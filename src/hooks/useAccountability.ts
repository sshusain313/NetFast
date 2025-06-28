import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiService, { SpiritualSponsor, ProgressReport } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface ProgressReportData {
  daysCompleted: number;
  totalDays: number;
  lastViolation?: Date;
  violationCount: number;
  strengthMoments: string[];
}

export const useAccountability = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && !!window.electronAPI);
  }, []);

  // Get spiritual sponsors
  const {
    data: sponsors,
    isLoading: sponsorsLoading,
    error: sponsorsError,
  } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const response = await apiService.getSponsors();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch sponsors');
      }
      return response.data || [];
    },
    enabled: isAuthenticated,
  });

  // Get progress reports
  const {
    data: progressReports,
    isLoading: reportsLoading,
    error: reportsError,
  } = useQuery({
    queryKey: ['progress-reports'],
    queryFn: async () => {
      const response = await apiService.getProgressReports();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch progress reports');
      }
      return response.data || [];
    },
    enabled: isAuthenticated,
  });

  // Create spiritual sponsor
  const createSponsorMutation = useMutation({
    mutationFn: async (sponsorData: Omit<SpiritualSponsor, 'id' | 'user_id' | 'created_at'>) => {
      const response = await apiService.createSponsor(sponsorData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create sponsor');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast.success('Spiritual sponsor added successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add spiritual sponsor');
    },
  });

  // Update spiritual sponsor
  const updateSponsorMutation = useMutation({
    mutationFn: async ({ sponsorId, sponsorData }: { sponsorId: string; sponsorData: Partial<SpiritualSponsor> }) => {
      const response = await apiService.updateSponsor(sponsorId, sponsorData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update sponsor');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast.success('Spiritual sponsor updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update spiritual sponsor');
    },
  });

  // Delete spiritual sponsor
  const deleteSponsorMutation = useMutation({
    mutationFn: async (sponsorId: string) => {
      const response = await apiService.deleteSponsor(sponsorId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete sponsor');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      toast.success('Spiritual sponsor removed successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove spiritual sponsor');
    },
  });

  // Create progress report
  const createProgressReportMutation = useMutation({
    mutationFn: async ({ daysCompleted, violationCount }: { daysCompleted: number; violationCount: number }) => {
      const response = await apiService.createProgressReport(daysCompleted, violationCount);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create progress report');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress-reports'] });
      toast.success('Progress report created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create progress report');
    },
  });

  const setSpiritualSponsor = async (sponsorData: Omit<SpiritualSponsor, 'id' | 'user_id' | 'created_at'>) => {
    await createSponsorMutation.mutateAsync(sponsorData);
  };

  const removeSponsor = async (sponsorId: string) => {
    await deleteSponsorMutation.mutateAsync(sponsorId);
  };

  const notifyViolationAttempt = async (violationType: string, deviceId?: string) => {
    if (!sponsors || sponsors.length === 0) {
      toast.error('No spiritual sponsors configured');
      return;
    }

    try {
      // Report violation to backend
      if (deviceId) {
        await apiService.reportViolation(deviceId, violationType, 'User attempted to access blocked content');
      }

      // Notify sponsors via Electron if available
      if (isElectron) {
        for (const sponsor of sponsors) {
          if (sponsor.isActive) {
            await window.electronAPI.notifySpiritualSponsor({
              sponsor,
              violationType,
              timestamp: new Date().toISOString(),
            });
          }
        }
      }

      toast.error('Violation attempt logged and sponsors notified');
    } catch (error) {
      console.error('Failed to notify spiritual sponsor:', error);
      toast.error('Failed to notify sponsors');
    }
  };

  const sendProgressReport = async (progress: ProgressReportData) => {
    try {
      // Create progress report in backend
      await createProgressReportMutation.mutateAsync({
        daysCompleted: progress.daysCompleted,
        violationCount: progress.violationCount,
      });

      // Send to sponsors via Electron if available
      if (isElectron && sponsors && sponsors.length > 0) {
        for (const sponsor of sponsors) {
          if (sponsor.isActive) {
            await window.electronAPI.sendProgressReport({
              sponsor,
              progress,
              timestamp: new Date().toISOString(),
            });
          }
        }
      }

      toast.success('Progress report sent successfully');
    } catch (error) {
      console.error('Failed to send progress report:', error);
      toast.error('Failed to send progress report');
    }
  };

  return {
    sponsors: sponsors || [],
    progressReports: progressReports || [],
    sponsorsLoading,
    reportsLoading,
    sponsorsError,
    reportsError,
    isElectron,
    setSpiritualSponsor: createSponsorMutation.mutate,
    updateSponsor: updateSponsorMutation.mutate,
    removeSponsor: deleteSponsorMutation.mutate,
    notifyViolationAttempt,
    sendProgressReport,
    createProgressReport: createProgressReportMutation.mutate,
    isLoading: createSponsorMutation.isPending || updateSponsorMutation.isPending || deleteSponsorMutation.isPending,
  };
};
