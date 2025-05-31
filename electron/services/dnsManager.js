
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
        command = 'netsh interface ip show dns';
      } else if (this.platform === 'darwin') {
        command = 'scutil --dns | grep nameserver';
      } else {
        command = 'cat /etc/resolv.conf | grep nameserver';
      }
      
      const { stdout } = await execAsync(command);
      return {
        success: true,
        currentDNS: stdout,
        isFiltered: this.isFilteredDNS(stdout)
      };
    } catch (error) {
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
        command = `netsh interface ip set dns "${interfaceName}" static ${servers[0]} && netsh interface ip add dns "${interfaceName}" ${servers[1]} index=2`;
      } else if (this.platform === 'darwin') {
        const interfaceName = await this.getActiveInterface();
        command = `networksetup -setdnsservers "${interfaceName}" ${servers.join(' ')}`;
      } else {
        // Linux
        const dnsConfig = servers.map(server => `nameserver ${server}`).join('\n');
        command = `echo "${dnsConfig}" | sudo tee /etc/resolv.conf`;
      }
      
      await execAsync(command);
      
      return {
        success: true,
        appliedServers: servers,
        filterType
      };
    } catch (error) {
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
      
      await execAsync(command);
      
      return {
        success: true,
        message: 'DNS filter removed, restored to automatic'
      };
    } catch (error) {
      throw new Error(`Failed to remove DNS filter: ${error.message}`);
    }
  }

  async getActiveInterface() {
    try {
      let command;
      
      if (this.platform === 'win32') {
        command = 'netsh interface show interface | findstr "Connected"';
        const { stdout } = await execAsync(command);
        const lines = stdout.split('\n');
        for (const line of lines) {
          if (line.includes('Connected')) {
            return line.split(/\s+/).pop().trim();
          }
        }
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
      throw new Error(`Failed to get active interface: ${error.message}`);
    }
  }
}

module.exports = new DNSManager();
