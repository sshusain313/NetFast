const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // DNS Management
  checkDNSStatus: () => ipcRenderer.invoke('check-dns-status'),
  applyDNSFilter: (filterType) => ipcRenderer.invoke('apply-dns-filter', filterType),
  removeDNSFilter: () => ipcRenderer.invoke('remove-dns-filter'),
  requestAdminPrivileges: () => ipcRenderer.invoke('request-admin-privileges'),
  
  // Device Management
  getDeviceInfo: () => ipcRenderer.invoke('get-device-info'),
  registerDevice: (deviceData) => ipcRenderer.invoke('register-device', deviceData),
  sendHeartbeat: (heartbeatData) => ipcRenderer.invoke('send-heartbeat', heartbeatData),
  
  // Accountability Features
  notifySpiritualSponsor: (data) => ipcRenderer.invoke('notify-spiritual-sponsor', data),
  sendProgressReport: (data) => ipcRenderer.invoke('send-progress-report', data),
  
  // Monitoring Settings
  updateMonitoringSettings: (settings) => ipcRenderer.invoke('update-monitoring-settings', settings),
  getViolationStatus: () => ipcRenderer.invoke('get-violation-status'),
  
  // Security and Monitoring
  reportViolation: (violationData) => ipcRenderer.invoke('report-violation', violationData),
  
  // App lifecycle
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  
  // Enhanced Notifications
  showNotification: (notificationData) => ipcRenderer.invoke('show-notification', notificationData),
  
  // Platform info
  platform: process.platform,
});
