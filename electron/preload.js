
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // DNS Management
  checkDNSStatus: () => ipcRenderer.invoke('check-dns-status'),
  applyDNSFilter: (filterType) => ipcRenderer.invoke('apply-dns-filter', filterType),
  removeDNSFilter: () => ipcRenderer.invoke('remove-dns-filter'),
  requestAdminPrivileges: () => ipcRenderer.invoke('request-admin-privileges'),
  
  // Accountability Features
  notifySpiritualSponsor: (data) => ipcRenderer.invoke('notify-spiritual-sponsor', data),
  sendProgressReport: (data) => ipcRenderer.invoke('send-progress-report', data),
  
  // Monitoring Settings
  updateMonitoringSettings: (settings) => ipcRenderer.invoke('update-monitoring-settings', settings),
  getViolationStatus: () => ipcRenderer.invoke('get-violation-status'),
  
  // Platform info
  platform: process.platform,
  
  // App info
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Notifications
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body)
});
