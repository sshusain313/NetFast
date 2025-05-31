
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

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
    icon: path.join(__dirname, '../public/favicon.ico'),
    titleBarStyle: 'hiddenInset',
    show: false
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
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

app.whenReady().then(createWindow);

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
  return await dnsManager.checkCurrentDNS();
});

ipcMain.handle('apply-dns-filter', async (event, filterType) => {
  const dnsManager = require('./services/dnsManager');
  try {
    const result = await dnsManager.applyDNSFilter(filterType);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('remove-dns-filter', async () => {
  const dnsManager = require('./services/dnsManager');
  try {
    const result = await dnsManager.removeDNSFilter();
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('request-admin-privileges', async () => {
  try {
    const sudo = require('sudo-prompt');
    const options = {
      name: 'NetFast - Digital Discipline',
      icns: path.join(__dirname, '../public/favicon.ico'),
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
  } catch (error) {
    return { success: false, error: error.message };
  }
});
