const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

// Better development detection
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let deviceToken = null;
let isDeviceRegistered = false;

// Generate a unique device token
function generateDeviceToken() {
  const machineId = os.hostname() + os.platform() + os.arch();
  const hash = crypto.createHash('sha256').update(machineId).digest('hex');
  return `device_${hash.substring(0, 16)}`;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/merchx.jpeg'),
    titleBarStyle: 'hiddenInset',
    show: false
  });

  // Load the app
  if (isDev) {
    // Try to load from development server first
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
    
    // Handle load failures
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.log('Failed to load from dev server:', errorDescription);
      console.log('Make sure the frontend is running with: npm run dev');
      
      // Show error dialog
      dialog.showErrorBox(
        'Development Server Not Found',
        'Please start the frontend development server first:\n\nnpm run dev\n\nThen restart Electron.'
      );
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Generate device token on app start
  deviceToken = generateDeviceToken();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for DNS management
ipcMain.handle('check-dns-status', async () => {
  const dnsManager = require('./services/dnsManager');
  try {
    console.log('🔍 Checking DNS status...');
    const result = await dnsManager.checkCurrentDNS();
    console.log('📡 DNS Status result:', result);
    
    // Return the result in the expected format
    return {
      success: result.success,
      currentDNS: result.currentDNS,
      isFiltered: result.isFiltered,
      error: result.error
    };
  } catch (error) {
    console.error('❌ DNS Status check failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('apply-dns-filter', async (event, filterType) => {
  const dnsManager = require('./services/dnsManager');
  try {
    console.log('🛡️ Applying DNS filter:', filterType);
    const result = await dnsManager.applyDNSFilter(filterType);
    
    // Start protection monitoring after applying DNS filter
    const protectionManager = require('./services/protectionManager');
    await protectionManager.startMonitoring();
    
    console.log('✅ DNS filter applied successfully');
    return { success: true, result };
  } catch (error) {
    console.error('❌ Failed to apply DNS filter:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('remove-dns-filter', async () => {
  const dnsManager = require('./services/dnsManager');
  try {
    console.log('🔄 Removing DNS filter...');
    const result = await dnsManager.removeDNSFilter();
    
    // Stop protection monitoring when removing DNS filter
    const protectionManager = require('./services/protectionManager');
    await protectionManager.stopMonitoring();
    
    console.log('✅ DNS filter removed successfully');
    return { success: true, result };
  } catch (error) {
    console.error('❌ Failed to remove DNS filter:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('request-admin-privileges', async () => {
  try {
    // For Windows, we'll skip the admin check and let DNS operations fail naturally
    // This avoids issues with sudo-prompt and provides better user experience
    if (process.platform === 'win32') {
      console.log('✅ Proceeding with DNS operations (admin check skipped)');
      return { success: true };
    } else {
      // For macOS/Linux, use sudo-prompt
      const sudo = require('sudo-prompt');
      
      // Use a simpler name that meets sudo-prompt requirements
      const options = {
        name: 'NetFast Digital Discipline',
        icns: path.join(__dirname, '../public/merchx.jpeg'),
      };
      
      return new Promise((resolve) => {
        sudo.exec('echo "Admin access granted"', options, (error, stdout, stderr) => {
          if (error) {
            resolve({ success: false, error: error.message });
          } else {
            resolve({ success: true });
          }
        });
      });
    }
  } catch (error) {
    console.error('❌ Admin privileges request failed:', error);
    return { success: false, error: error.message };
  }
});

// Device management
ipcMain.handle('get-device-info', () => {
  return {
    token: deviceToken,
    platform: os.platform(),
    hostname: os.hostname(),
    isRegistered: isDeviceRegistered
  };
});

ipcMain.handle('register-device', async (event, deviceData) => {
  try {
    // In a real implementation, this would call the backend API
    // For now, we'll simulate device registration
    isDeviceRegistered = true;
    
    // Store device registration in local storage
    const fs = require('fs');
    const deviceConfigPath = path.join(app.getPath('userData'), 'device-config.json');
    const deviceConfig = {
      token: deviceToken,
      platform: os.platform(),
      registeredAt: new Date().toISOString(),
      ...deviceData
    };
    
    fs.writeFileSync(deviceConfigPath, JSON.stringify(deviceConfig, null, 2));
    
    return { success: true, deviceId: deviceToken };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('send-heartbeat', async (event, heartbeatData) => {
  try {
    // In a real implementation, this would send heartbeat to backend
    // For now, we'll just log it
    console.log('Heartbeat sent:', heartbeatData);
    
    // Update device status
    const fs = require('fs');
    const deviceConfigPath = path.join(app.getPath('userData'), 'device-config.json');
    if (fs.existsSync(deviceConfigPath)) {
      const deviceConfig = JSON.parse(fs.readFileSync(deviceConfigPath, 'utf8'));
      deviceConfig.lastHeartbeat = new Date().toISOString();
      deviceConfig.dnsStatus = heartbeatData.dnsStatus;
      fs.writeFileSync(deviceConfigPath, JSON.stringify(deviceConfig, null, 2));
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Enhanced accountability features
ipcMain.handle('notify-spiritual-sponsor', async (event, data) => {
  const accountabilityManager = require('./services/accountabilityManager');
  try {
    const result = await accountabilityManager.notifySpiritualSponsor(data);
    
    // Also report violation to backend if available
    if (data.deviceId) {
      // This would be a call to the backend API
      console.log('Violation reported to backend:', {
        deviceId: data.deviceId,
        type: data.violationType,
        timestamp: data.timestamp
      });
    }
    
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('send-progress-report', async (event, data) => {
  const accountabilityManager = require('./services/accountabilityManager');
  try {
    const result = await accountabilityManager.sendProgressReport(data);
    
    // Also send progress report to backend if available
    console.log('Progress report sent to backend:', {
      daysCompleted: data.progress.daysCompleted,
      violationCount: data.progress.violationCount,
      timestamp: data.timestamp
    });
    
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-monitoring-settings', async (event, settings) => {
  const protectionManager = require('./services/protectionManager');
  try {
    protectionManager.updateSettings(settings);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-violation-status', async () => {
  const protectionManager = require('./services/protectionManager');
  try {
    return protectionManager.getViolationStatus();
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Security and monitoring
ipcMain.handle('report-violation', async (event, violationData) => {
  try {
    // Log violation locally
    const fs = require('fs');
    const violationsPath = path.join(app.getPath('userData'), 'violations.json');
    let violations = [];
    
    if (fs.existsSync(violationsPath)) {
      violations = JSON.parse(fs.readFileSync(violationsPath, 'utf8'));
    }
    
    violations.push({
      ...violationData,
      timestamp: new Date().toISOString(),
      deviceToken: deviceToken
    });
    
    fs.writeFileSync(violationsPath, JSON.stringify(violations, null, 2));
    
    // In a real implementation, this would also send to backend
    console.log('Violation logged:', violationData);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// App lifecycle management
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('quit-app', () => {
  app.quit();
});

// Enhanced notifications
ipcMain.handle('show-notification', async (event, { title, body, type = 'info' }) => {
  const { Notification } = require('electron');
  
  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
      icon: path.join(__dirname, '../public/merchx.jpeg'),
      silent: false
    });
    
    notification.show();
    return { success: true };
  }
  
  return { success: false, error: 'Notifications not supported' };
});
