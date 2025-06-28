import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import apiService, { 
  AdminStats, 
  AdminUser, 
  AdminDevice, 
  AdminSubscription, 
  AdminViolation, 
  AdminAnalytics, 
  AdminSettings, 
  SystemInfo 
} from '@/services/api';

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [devices, setDevices] = useState<AdminDevice[]>([]);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [violations, setViolations] = useState<AdminViolation[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  // Pagination states
  const [userPagination, setUserPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [devicePagination, setDevicePagination] = useState({ page: 1, total: 0, pages: 0 });
  const [subscriptionPagination, setSubscriptionPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [violationPagination, setViolationPagination] = useState({ page: 1, total: 0, pages: 0 });

  // Fetch admin stats
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getAdminStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        toast.error('Failed to fetch admin stats');
      }
    } catch (error) {
      toast.error('Error fetching admin stats');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users with pagination and search
  const fetchUsers = useCallback(async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const response = await apiService.getAdminUsers(page, 10, search);
      if (response.success && response.data) {
        setUsers(response.data.users);
        setUserPagination({
          page: response.data.page,
          total: response.data.total,
          pages: response.data.pages
        });
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch devices with pagination
  const fetchDevices = useCallback(async (page: number = 1, status?: string) => {
    setLoading(true);
    try {
      const response = await apiService.getAdminDevices(page, 10, status);
      if (response.success && response.data) {
        setDevices(response.data.devices);
        setDevicePagination({
          page: response.data.page,
          total: response.data.total,
          pages: response.data.pages
        });
      } else {
        toast.error('Failed to fetch devices');
      }
    } catch (error) {
      toast.error('Error fetching devices');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch subscriptions with pagination
  const fetchSubscriptions = useCallback(async (page: number = 1, status?: string) => {
    setLoading(true);
    try {
      const response = await apiService.getAdminSubscriptions(page, 10, status);
      if (response.success && response.data) {
        setSubscriptions(response.data.subscriptions);
        setSubscriptionPagination({
          page: response.data.page,
          total: response.data.total,
          pages: response.data.pages
        });
      } else {
        toast.error('Failed to fetch subscriptions');
      }
    } catch (error) {
      toast.error('Error fetching subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch violations with pagination and filtering
  const fetchViolations = useCallback(async (page: number = 1, severity?: string, timeFilter: string = 'today') => {
    setLoading(true);
    try {
      const response = await apiService.getAdminViolations(page, 10, severity, timeFilter);
      if (response.success && response.data) {
        setViolations(response.data.violations);
        setViolationPagination({
          page: response.data.page,
          total: response.data.total,
          pages: response.data.pages
        });
      } else {
        toast.error('Failed to fetch violations');
      }
    } catch (error) {
      toast.error('Error fetching violations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch analytics
  const fetchAnalytics = useCallback(async (period: number = 30) => {
    setLoading(true);
    try {
      const response = await apiService.getAdminAnalytics(period);
      if (response.success && response.data) {
        setAnalytics(response.data);
      } else {
        toast.error('Failed to fetch analytics');
      }
    } catch (error) {
      toast.error('Error fetching analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getAdminSettings();
      if (response.success && response.data) {
        setSettings(response.data.settings);
        setSystemInfo(response.data.systemInfo);
      } else {
        toast.error('Failed to fetch settings');
      }
    } catch (error) {
      toast.error('Error fetching settings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user status
  const updateUserStatus = useCallback(async (userId: string, status: 'active' | 'suspended') => {
    try {
      const response = await apiService.updateUserStatus(userId, status);
      if (response.success) {
        toast.success(`User ${status === 'active' ? 'activated' : 'suspended'} successfully`);
        // Refresh users list
        fetchUsers(userPagination.page);
        return true;
      } else {
        toast.error('Failed to update user status');
        return false;
      }
    } catch (error) {
      toast.error('Error updating user status');
      return false;
    }
  }, [fetchUsers, userPagination.page]);

  // Force device sync
  const forceDeviceSync = useCallback(async (deviceId: string) => {
    try {
      const response = await apiService.forceDeviceSync(deviceId);
      if (response.success) {
        toast.success('Sync request sent to device');
        // Refresh devices list
        fetchDevices(devicePagination.page);
        return true;
      } else {
        toast.error('Failed to send sync request');
        return false;
      }
    } catch (error) {
      toast.error('Error sending sync request');
      return false;
    }
  }, [fetchDevices, devicePagination.page]);

  // Disconnect device
  const disconnectDevice = useCallback(async (deviceId: string) => {
    try {
      const response = await apiService.disconnectDevice(deviceId);
      if (response.success) {
        toast.success('Device disconnected successfully');
        // Refresh devices list
        fetchDevices(devicePagination.page);
        return true;
      } else {
        toast.error('Failed to disconnect device');
        return false;
      }
    } catch (error) {
      toast.error('Error disconnecting device');
      return false;
    }
  }, [fetchDevices, devicePagination.page]);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<AdminSettings>) => {
    try {
      const response = await apiService.updateAdminSettings(newSettings);
      if (response.success && response.data) {
        setSettings(response.data.settings);
        toast.success('Settings updated successfully');
        return true;
      } else {
        toast.error('Failed to update settings');
        return false;
      }
    } catch (error) {
      toast.error('Error updating settings');
      return false;
    }
  }, []);

  // Initialize admin data
  const initializeAdmin = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchUsers(),
      fetchDevices(),
      fetchSubscriptions(),
      fetchViolations(),
      fetchAnalytics(),
      fetchSettings()
    ]);
  }, [fetchStats, fetchUsers, fetchDevices, fetchSubscriptions, fetchViolations, fetchAnalytics, fetchSettings]);

  return {
    loading,
    stats,
    users,
    devices,
    subscriptions,
    violations,
    analytics,
    settings,
    systemInfo,
    userPagination,
    devicePagination,
    subscriptionPagination,
    violationPagination,
    fetchStats,
    fetchUsers,
    fetchDevices,
    fetchSubscriptions,
    fetchViolations,
    fetchAnalytics,
    fetchSettings,
    updateUserStatus,
    forceDeviceSync,
    disconnectDevice,
    updateSettings,
    initializeAdmin
  };
}; 