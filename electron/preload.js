
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  checkDNSStatus: () => ipcRenderer.invoke('check-dns-status'),
  applyDNSFilter: (filterType) => ipcRenderer.invoke('apply-dns-filter', filterType),
  removeDNSFilter: () => ipcRenderer.invoke('remove-dns-filter'),
  requestAdminPrivileges: () => ipcRenderer.invoke('request-admin-privileges'),
  
  // Platform info
  platform: process.platform,
  
  // App info
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Notifications
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body)
});

// Type definitions for TypeScript
window.electronAPI = {
  checkDNSStatus: () => Promise,
  applyDNSFilter: (filterType) => Promise,
  removeDNSFilter: () => Promise,
  requestAdminPrivileges: () => Promise,
  platform: string,
  getVersion: () => Promise,
  showNotification: (title, body) => Promise
};
