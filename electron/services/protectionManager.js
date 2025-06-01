const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class ProtectionManager {
  constructor() {
    this.platform = process.platform;
    this.monitoringActive = false;
    this.violationCount = 0;
    this.maxViolations = 2;
    this.settings = {
      autoStartOnBoot: true,
      backgroundService: true,
      usageMonitoring: false,
      screenshotDetection: false,
      proxyVpnDetection: true
    };
  }

  async startMonitoring() {
    if (this.monitoringActive) return;
    
    this.monitoringActive = true;
    console.log('🛡️ NetFast protection monitoring started');
    
    // Monitor DNS changes every 30 seconds
    this.dnsMonitorInterval = setInterval(() => {
      this.checkDNSIntegrity();
    }, 30000);

    // Monitor VPN connections if enabled
    if (this.settings.proxyVpnDetection) {
      this.vpnMonitorInterval = setInterval(() => {
        this.checkVPNStatus();
      }, 15000);
    }

    // Usage monitoring if enabled
    if (this.settings.usageMonitoring) {
      this.usageMonitorInterval = setInterval(() => {
        this.monitorAppUsage();
      }, 60000); // Check every minute
    }

    // Auto-start setup
    if (this.settings.autoStartOnBoot) {
      await this.setupAutoStart();
    }
  }

  async stopMonitoring() {
    this.monitoringActive = false;
    
    if (this.dnsMonitorInterval) clearInterval(this.dnsMonitorInterval);
    if (this.vpnMonitorInterval) clearInterval(this.vpnMonitorInterval);
    if (this.usageMonitorInterval) clearInterval(this.usageMonitorInterval);
    
    console.log('🛡️ NetFast protection monitoring stopped');
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    console.log('📝 Monitoring settings updated:', this.settings);
    
    // Restart monitoring with new settings if active
    if (this.monitoringActive) {
      this.stopMonitoring();
      this.startMonitoring();
    }
  }

  async setupAutoStart() {
    try {
      if (this.platform === 'win32') {
        // Windows: Add to startup registry
        const command = `reg add "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "NetFast" /t REG_SZ /d "${process.execPath}" /f`;
        await execAsync(command);
      } else if (this.platform === 'darwin') {
        // macOS: Create launch agent
        const plistPath = path.join(require('os').homedir(), 'Library/LaunchAgents/com.netfast.app.plist');
        const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.netfast.app</string>
    <key>ProgramArguments</key>
    <array>
        <string>${process.execPath}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>`;
        fs.writeFileSync(plistPath, plistContent);
      } else {
        // Linux: Create desktop autostart entry
        const autostartDir = path.join(require('os').homedir(), '.config/autostart');
        if (!fs.existsSync(autostartDir)) {
          fs.mkdirSync(autostartDir, { recursive: true });
        }
        const desktopFile = path.join(autostartDir, 'netfast.desktop');
        const desktopContent = `[Desktop Entry]
Type=Application
Name=NetFast
Exec=${process.execPath}
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true`;
        fs.writeFileSync(desktopFile, desktopContent);
      }
      
      console.log('✅ Auto-start configured successfully');
    } catch (error) {
      console.error('❌ Failed to setup auto-start:', error);
    }
  }

  async checkDNSIntegrity() {
    try {
      const dnsManager = require('./dnsManager');
      const status = await dnsManager.checkCurrentDNS();
      
      if (status.success && !status.isFiltered) {
        await this.handleViolation('DNS settings were modified');
      }
    } catch (error) {
      console.error('DNS integrity check failed:', error);
    }
  }

  async checkVPNStatus() {
    try {
      let command;
      
      if (this.platform === 'win32') {
        command = 'netsh interface show interface | findstr "VPN\\|TAP\\|TUN"';
      } else if (this.platform === 'darwin') {
        command = 'ifconfig | grep -E "(tun|tap|utun|ppp)"';
      } else {
        command = 'ip link show | grep -E "(tun|tap|ppp)"';
      }
      
      const { stdout } = await execAsync(command);
      
      if (stdout && stdout.trim().length > 0) {
        await this.handleViolation('VPN/Proxy connection detected');
      }
    } catch (error) {
      // No VPN detected (expected case)
    }
  }

  async monitorAppUsage() {
    if (!this.settings.usageMonitoring) return;
    
    try {
      let command;
      
      if (this.platform === 'win32') {
        command = 'tasklist /FO CSV | findstr "chrome.exe\\|firefox.exe\\|msedge.exe"';
      } else if (this.platform === 'darwin') {
        command = 'ps aux | grep -E "(Chrome|Firefox|Safari)" | grep -v grep';
      } else {
        command = 'ps aux | grep -E "(chrome|firefox|chromium)" | grep -v grep';
      }
      
      const { stdout } = await execAsync(command);
      
      if (stdout && stdout.trim().length > 0) {
        console.log('📱 Browser usage detected:', stdout.split('\n').length, 'processes');
        
        // Log usage for progress reports
        const accountabilityManager = require('./accountabilityManager');
        accountabilityManager.addStrengthMoment(`Monitored browser usage at ${new Date().toLocaleTimeString()}`);
      }
    } catch (error) {
      // Normal - no browsers running
    }
  }

  async handleViolation(reason) {
    this.violationCount++;
    
    console.log(`⚠️ Violation detected: ${reason} (${this.violationCount}/${this.maxViolations})`);
    
    // Notify spiritual sponsor
    try {
      const accountabilityManager = require('./accountabilityManager');
      await accountabilityManager.notifySpiritualSponsor({
        sponsor: this.getSponsorData(),
        violationType: reason,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to notify sponsor:', error);
    }
    
    if (this.violationCount === 1) {
      await this.showCompassionateWarning(reason);
    } else if (this.violationCount >= this.maxViolations) {
      await this.terminateSubscription(reason);
    }
  }

  getSponsorData() {
    // Get sponsor data from localStorage or return null
    try {
      const sponsorData = require('electron').app.getPath('userData');
      // In a real implementation, you'd read from a proper storage
      return null; // Placeholder
    } catch {
      return null;
    }
  }

  async showCompassionateWarning(reason) {
    const { dialog } = require('electron');
    
    const response = await dialog.showMessageBox({
      type: 'warning',
      title: 'NetFast - Gentle Reminder',
      message: 'Your Sacred Commitment',
      detail: `We noticed an attempt to modify your digital discipline settings (${reason}). 

Remember, you chose this path for your spiritual growth and inner peace. 

This is your compassionate reminder - we believe in your strength to honor your commitment. 

One more attempt to bypass your protection will unfortunately require us to end your sacred journey with NetFast.`,
      buttons: ['I Understand', 'Restore My Protection'],
      defaultId: 1,
      cancelId: 0
    });

    if (response.response === 1) {
      const dnsManager = require('./dnsManager');
      await dnsManager.applyDNSFilter('opendns');
      this.violationCount = 0;
    }
  }

  async terminateSubscription(reason) {
    const { dialog, app } = require('electron');
    
    await dialog.showMessageBox({
      type: 'info',
      title: 'NetFast - Journey Complete',
      message: 'Your Sacred Journey Has Ended',
      detail: `We understand that the path of digital discipline is challenging. 

Your subscription has been terminated due to repeated attempts to bypass your protection (${reason}).

When you're ready to commit fully to your spiritual growth, we'll be here to welcome you back with open arms.

May you find peace in your choices. 🙏`,
      buttons: ['Close']
    });

    const dnsManager = require('./dnsManager');
    await dnsManager.removeDNSFilter();
    
    app.quit();
  }

  getViolationStatus() {
    return {
      violationCount: this.violationCount,
      maxViolations: this.maxViolations,
      remainingWarnings: Math.max(0, this.maxViolations - this.violationCount)
    };
  }
}

module.exports = new ProtectionManager();
