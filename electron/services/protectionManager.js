
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
    this.maxViolations = 2; // One warning, then termination
  }

  async startMonitoring() {
    if (this.monitoringActive) return;
    
    this.monitoringActive = true;
    console.log('🛡️ NetFast protection monitoring started');
    
    // Monitor DNS changes every 30 seconds
    this.dnsMonitorInterval = setInterval(() => {
      this.checkDNSIntegrity();
    }, 30000);

    // Monitor VPN connections
    this.vpnMonitorInterval = setInterval(() => {
      this.checkVPNStatus();
    }, 15000);
  }

  async stopMonitoring() {
    this.monitoringActive = false;
    
    if (this.dnsMonitorInterval) {
      clearInterval(this.dnsMonitorInterval);
    }
    
    if (this.vpnMonitorInterval) {
      clearInterval(this.vpnMonitorInterval);
    }
    
    console.log('🛡️ NetFast protection monitoring stopped');
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
        await this.handleViolation('VPN connection detected');
      }
    } catch (error) {
      // No VPN detected (expected case)
    }
  }

  async handleViolation(reason) {
    this.violationCount++;
    
    console.log(`⚠️ Violation detected: ${reason} (${this.violationCount}/${this.maxViolations})`);
    
    if (this.violationCount === 1) {
      // First violation - compassionate warning
      await this.showCompassionateWarning(reason);
    } else if (this.violationCount >= this.maxViolations) {
      // Second violation - terminate subscription
      await this.terminateSubscription(reason);
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
      // User chose to restore protection
      const dnsManager = require('./dnsManager');
      await dnsManager.applyDNSFilter('opendns');
      this.violationCount = 0; // Reset violation count
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

    // Remove DNS protection
    const dnsManager = require('./dnsManager');
    await dnsManager.removeDNSFilter();
    
    // Close the application
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
