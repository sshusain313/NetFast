interface ElectronAPI {
  // DNS Management
  checkDNSStatus: () => Promise<any>;
  applyDNSFilter: (filterType: string) => Promise<any>;
  removeDNSFilter: () => Promise<any>;
  requestAdminPrivileges: () => Promise<any>;
  
  // Accountability Features
  notifySpiritualSponsor: (data: any) => Promise<any>;
  sendProgressReport: (data: any) => Promise<any>;
  
  // Monitoring Settings
  updateMonitoringSettings: (settings: any) => Promise<any>;
  getViolationStatus: () => Promise<any>;
  
  // Platform info
  platform: string;
  
  // App info
  getVersion: () => Promise<string>;
  
  // Notifications
  showNotification: (title: string, body: string) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
