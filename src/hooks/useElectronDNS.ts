
import { useState, useEffect } from 'react';

interface DNSStatus {
  success: boolean;
  currentDNS?: string;
  isFiltered?: boolean;
  filterType?: string;
  error?: string;
}

interface DNSResult {
  success: boolean;
  result?: any;
  filterType?: string;
  error?: string;
}

export const useElectronDNS = () => {
  const [dnsStatus, setDnsStatus] = useState<DNSStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if we're running in Electron
    setIsElectron(typeof window !== 'undefined' && !!window.electronAPI);
  }, []);

  const checkDNSStatus = async (): Promise<DNSStatus> => {
    if (!isElectron) {
      return { success: false, error: 'Not running in Electron environment' };
    }

    setIsLoading(true);
    try {
      const status = await window.electronAPI.checkDNSStatus();
      setDnsStatus(status);
      return status;
    } catch (error) {
      const errorResult = { success: false, error: error.message };
      setDnsStatus(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  };

  const applyDNSFilter = async (filterType: string = 'opendns'): Promise<DNSResult> => {
    if (!isElectron) {
      return { success: false, error: 'Not running in Electron environment' };
    }

    setIsLoading(true);
    try {
      const result = await window.electronAPI.applyDNSFilter(filterType);
      
      // Refresh DNS status after applying filter
      if (result.success) {
        await checkDNSStatus();
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const removeDNSFilter = async (): Promise<DNSResult> => {
    if (!isElectron) {
      return { success: false, error: 'Not running in Electron environment' };
    }

    setIsLoading(true);
    try {
      const result = await window.electronAPI.removeDNSFilter();
      
      // Refresh DNS status after removing filter
      if (result.success) {
        await checkDNSStatus();
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const requestAdminPrivileges = async (): Promise<DNSResult> => {
    if (!isElectron) {
      return { success: false, error: 'Not running in Electron environment' };
    }

    try {
      return await window.electronAPI.requestAdminPrivileges();
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    dnsStatus,
    isLoading,
    isElectron,
    checkDNSStatus,
    applyDNSFilter,
    removeDNSFilter,
    requestAdminPrivileges
  };
};
