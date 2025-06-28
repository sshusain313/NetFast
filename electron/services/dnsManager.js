const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class DNSManager {
  constructor() {
    this.platform = os.platform();
    this.dnsServers = {
      opendns: ['208.67.222.222', '208.67.220.220'],
      cleanBrowsing: ['185.228.168.168', '185.228.169.168'],
      cloudflareFamily: ['1.1.1.3', '1.0.0.3']
    };
  }

  async checkCurrentDNS() {
    try {
      let command;
      
      if (this.platform === 'win32') {
        // Use a more specific command to get actual DNS servers
        command = 'powershell -Command "Get-DnsClientServerAddress | Where-Object {$_.ServerAddresses -ne $null} | Select-Object -First 1 | Select-Object -ExpandProperty ServerAddresses"';
      } else if (this.platform === 'darwin') {
        command = 'scutil --dns | grep nameserver';
      } else {
        command = 'cat /etc/resolv.conf | grep nameserver';
      }
      
      console.log(`🔍 Running DNS check command: ${command}`);
      const { stdout } = await execAsync(command);
      console.log(`📡 DNS output: ${stdout}`);
      
      const isFiltered = this.isFilteredDNS(stdout);
      console.log(`🛡️ Is filtered: ${isFiltered}`);
      
      return {
        success: true,
        currentDNS: stdout.trim(),
        isFiltered: isFiltered
      };
    } catch (error) {
      console.error('❌ DNS check failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  isFilteredDNS(dnsOutput) {
    const allFilterServers = [
      ...this.dnsServers.opendns,
      ...this.dnsServers.cleanBrowsing,
      ...this.dnsServers.cloudflareFamily
    ];
    
    return allFilterServers.some(server => dnsOutput.includes(server));
  }

  async applyDNSFilter(filterType = 'opendns') {
    const servers = this.dnsServers[filterType];
    if (!servers) {
      throw new Error(`Unknown filter type: ${filterType}`);
    }

    try {
      let command;
      
      if (this.platform === 'win32') {
        const interfaceName = await this.getActiveInterface();
        console.log(`🖥️ Using interface: ${interfaceName}`);
        
        // Use netsh command which is more reliable and doesn't require complex PowerShell elevation
        command = `netsh interface ip set dns "${interfaceName}" static ${servers[0]}`;
      } else if (this.platform === 'darwin') {
        const interfaceName = await this.getActiveInterface();
        command = `networksetup -setdnsservers "${interfaceName}" ${servers.join(' ')}`;
      } else {
        // Linux
        const dnsConfig = servers.map(server => `nameserver ${server}`).join('\n');
        command = `echo "${dnsConfig}" | sudo tee /etc/resolv.conf`;
      }
      
      console.log(`🛡️ Applying DNS filter with command: ${command}`);
      const result = await execAsync(command);
      console.log(`✅ DNS filter applied successfully:`, result.stdout);
      
      // Wait a moment for the change to take effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify the change
      const verification = await this.checkCurrentDNS();
      console.log(`🔍 Verification result:`, verification);
      
      return {
        success: true,
        appliedServers: servers,
        filterType,
        verification: verification
      };
    } catch (error) {
      console.error('❌ Failed to apply DNS filter:', error);
      
      // Check if it's a permission error
      if (error.message.includes('Access denied') || error.message.includes('PermissionDenied') || error.message.includes('Access to a CIM resource')) {
        throw new Error(`Administrator privileges required. Please run the application as administrator to change DNS settings.`);
      }
      
      throw new Error(`Failed to apply DNS filter: ${error.message}`);
    }
  }

  async removeDNSFilter() {
    try {
      let command;
      
      if (this.platform === 'win32') {
        const interfaceName = await this.getActiveInterface();
        command = `netsh interface ip set dns "${interfaceName}" dhcp`;
      } else if (this.platform === 'darwin') {
        const interfaceName = await this.getActiveInterface();
        command = `networksetup -setdnsservers "${interfaceName}" "Empty"`;
      } else {
        // Linux - restore to automatic
        command = 'sudo dhclient -r && sudo dhclient';
      }
      
      console.log(`🔄 Removing DNS filter with command: ${command}`);
      const result = await execAsync(command);
      console.log(`✅ DNS filter removed successfully:`, result.stdout);
      
      return {
        success: true,
        message: 'DNS filter removed, restored to automatic'
      };
    } catch (error) {
      console.error('❌ Failed to remove DNS filter:', error);
      
      // Check if it's a permission error
      if (error.message.includes('Access denied') || error.message.includes('PermissionDenied')) {
        throw new Error(`Administrator privileges required. Please run the application as administrator to change DNS settings.`);
      }
      
      throw new Error(`Failed to remove DNS filter: ${error.message}`);
    }
  }

  async getActiveInterface() {
    try {
      let command;
      
      if (this.platform === 'win32') {
        // Use a more reliable method to get the active interface
        command = 'powershell -Command "Get-NetAdapter | Where-Object {$_.Status -eq \'Up\'} | Select-Object -First 1 | Select-Object -ExpandProperty Name"';
        const { stdout } = await execAsync(command);
        const interfaceName = stdout.trim();
        
        if (!interfaceName) {
          // Fallback to the old method
          command = 'netsh interface show interface | findstr "Connected"';
          const { stdout: fallbackOutput } = await execAsync(command);
          const lines = fallbackOutput.split('\n');
          for (const line of lines) {
            if (line.includes('Connected')) {
              return line.split(/\s+/).pop().trim();
            }
          }
        }
        
        console.log(`🖥️ Detected interface: ${interfaceName}`);
        return interfaceName;
      } else if (this.platform === 'darwin') {
        command = 'route get default | grep interface';
        const { stdout } = await execAsync(command);
        const match = stdout.match(/interface: (\w+)/);
        if (match) {
          // Get the service name for this interface
          const serviceCommand = `networksetup -listallnetworkservices | grep -A1 ${match[1]}`;
          const { stdout: serviceOutput } = await execAsync(serviceCommand);
          return serviceOutput.split('\n')[0].trim();
        }
      }
      
      throw new Error('Could not determine active network interface');
    } catch (error) {
      console.error('❌ Failed to get active interface:', error);
      throw new Error(`Failed to get active interface: ${error.message}`);
    }
  }
}

module.exports = new DNSManager();
