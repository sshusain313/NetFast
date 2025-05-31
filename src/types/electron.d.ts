
export interface ElectronAPI {
  checkDNSStatus: () => Promise<{
    success: boolean;
    currentDNS?: string;
    isFiltered?: boolean;
    error?: string;
  }>;
  
  applyDNSFilter: (filterType: string) => Promise<{
    success: boolean;
    result?: any;
    error?: string;
  }>;
  
  removeDNSFilter: () => Promise<{
    success: boolean;
    result?: any;
    error?: string;
  }>;
  
  requestAdminPrivileges: () => Promise<{
    success: boolean;
    error?: string;
  }>;
  
  platform: string;
  getVersion: () => Promise<string>;
  showNotification: (title: string, body: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
