interface ElectronAPI {
  // DNS Management
  checkDNSStatus: () => Promise<any>;
  applyDNSFilter: (filterType: string) => Promise<any>;
  removeDNSFilter: () => Promise<any>;
  requestAdminPrivileges: () => Promise<any>;
  
  // Device Management
  getDeviceInfo: () => Promise<{
    token: string;
    platform: string;
    hostname: string;
    isRegistered: boolean;
  }>;
  registerDevice: (deviceData: any) => Promise<any>;
  sendHeartbeat: (heartbeatData: { dnsStatus: boolean }) => Promise<any>;
  
  // Accountability Features
  notifySpiritualSponsor: (data: any) => Promise<any>;
  sendProgressReport: (data: any) => Promise<any>;
  
  // Monitoring Settings
  updateMonitoringSettings: (settings: any) => Promise<any>;
  getViolationStatus: () => Promise<any>;
  
  // Security and Monitoring
  reportViolation: (violationData: {
    type: string;
    details: string;
    deviceId?: string;
  }) => Promise<any>;
  
  // App lifecycle
  getVersion: () => Promise<string>;
  quitApp: () => Promise<void>;
  
  // Enhanced Notifications
  showNotification: (notificationData: {
    title: string;
    body: string;
    type?: 'info' | 'warning' | 'error';
  }) => Promise<any>;
  
  // Platform info
  platform: string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
