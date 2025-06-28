import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiService, { Device } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useDeviceManagement = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && !!window.electronAPI);
  }, []);

  // Get all user devices
  const {
    data: devices,
    isLoading: devicesLoading,
    error: devicesError,
  } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await apiService.getDevices();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch devices');
      }
      return response.data || [];
    },
    enabled: isAuthenticated,
  });

  // Register new device
  const registerDeviceMutation = useMutation({
    mutationFn: async ({ deviceToken, platform }: { deviceToken: string; platform: string }) => {
      const response = await apiService.registerDevice(deviceToken, platform);
      if (!response.success) {
        throw new Error(response.error || 'Failed to register device');
      }
      return response.data;
    },
    onSuccess: (device) => {
      setCurrentDevice(device);
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device registered successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to register device');
    },
  });

  // Send heartbeat
  const heartbeatMutation = useMutation({
    mutationFn: async ({ deviceId, dnsStatus }: { deviceId: string; dnsStatus: boolean }) => {
      const response = await apiService.sendHeartbeat(deviceId, dnsStatus);
      if (!response.success) {
        throw new Error(response.error || 'Failed to send heartbeat');
      }
    },
    onError: (error) => {
      console.error('Heartbeat failed:', error);
    },
  });

  // Register current device if in Electron
  const registerCurrentDevice = useCallback(async () => {
    if (!isElectron || !isAuthenticated) return;

    try {
      // Generate a unique device token
      const deviceToken = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const platform = window.electronAPI?.platform || 'unknown';

      await registerDeviceMutation.mutateAsync({ deviceToken, platform });
    } catch (error) {
      console.error('Failed to register current device:', error);
    }
  }, [isElectron, isAuthenticated, registerDeviceMutation]);

  // Start heartbeat interval
  useEffect(() => {
    if (!currentDevice || !isAuthenticated) return;

    const interval = setInterval(async () => {
      if (isElectron) {
        try {
          // Get current DNS status from Electron
          const dnsStatus = await window.electronAPI.checkDNSStatus();
          const isProtected = dnsStatus?.isFiltered || false;

          await heartbeatMutation.mutateAsync({
            deviceId: currentDevice.id,
            dnsStatus: isProtected,
          });
        } catch (error) {
          console.error('Failed to send heartbeat:', error);
        }
      }
    }, 30000); // Send heartbeat every 30 seconds

    return () => clearInterval(interval);
  }, [currentDevice, isAuthenticated, isElectron, heartbeatMutation]);

  // Auto-register device on mount if in Electron and authenticated
  useEffect(() => {
    if (isElectron && isAuthenticated && !currentDevice && devices?.length === 0) {
      registerCurrentDevice();
    }
  }, [isElectron, isAuthenticated, currentDevice, devices, registerCurrentDevice]);

  // Find current device from devices list
  useEffect(() => {
    if (devices && isElectron) {
      // Try to find device by matching platform or other criteria
      const foundDevice = devices.find(device => 
        device.platform === (window.electronAPI?.platform || 'unknown')
      );
      if (foundDevice) {
        setCurrentDevice(foundDevice);
      }
    }
  }, [devices, isElectron]);

  return {
    devices,
    currentDevice,
    devicesLoading,
    devicesError,
    isElectron,
    registerDevice: registerDeviceMutation.mutate,
    registerDeviceLoading: registerDeviceMutation.isPending,
    sendHeartbeat: heartbeatMutation.mutate,
    registerCurrentDevice,
  };
}; 