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
      let detectedFilterType = null;
      
      if (this.platform === 'win32') {
        // Specifically check IPv4 DNS servers first
        command = 'powershell -Command "Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object {$_.ServerAddresses -ne $null} | Select-Object -First 1 | Select-Object -ExpandProperty ServerAddresses"';
      } else if (this.platform === 'darwin') {
        command = 'scutil --dns | grep nameserver';
      } else {
        command = 'cat /etc/resolv.conf | grep nameserver';
      }
      
      console.log(`🔍 Running IPv4 DNS check command: ${command}`);
      const { stdout } = await execAsync(command);
      console.log(`📡 IPv4 DNS output: ${stdout}`);
      
      // Check if we have IPv4 DNS servers
      let dnsServers = stdout.trim();
      
      // Check each DNS server against our known filter servers
      const filterServerMap = {};
      Object.entries(this.dnsServers).forEach(([type, servers]) => {
        servers.forEach(server => {
          filterServerMap[server] = type;
        });
      });
      
      // Normalize the DNS output and check for matches
      const normalizedOutput = dnsServers.split(/[\r\n]+/).map(line => line.trim());
      for (const line of normalizedOutput) {
        for (const [server, type] of Object.entries(filterServerMap)) {
          if (line.includes(server)) {
            console.log(`🔍 Detected filtered DNS in IPv4: ${server} (${type})`);
            detectedFilterType = type;
            break;
          }
        }
        if (detectedFilterType) break;
      }
      
      let isFiltered = !!detectedFilterType;
      
      // If no IPv4 DNS servers or they're not filtered, check IPv6
      if (!dnsServers || !isFiltered) {
        if (this.platform === 'win32') {
          const ipv6Command = 'powershell -Command "Get-DnsClientServerAddress -AddressFamily IPv6 | Where-Object {$_.ServerAddresses -ne $null} | Select-Object -First 1 | Select-Object -ExpandProperty ServerAddresses"';
          console.log(`🔍 Running IPv6 DNS check command: ${ipv6Command}`);
          const { stdout: ipv6Stdout } = await execAsync(ipv6Command);
          console.log(`📡 IPv6 DNS output: ${ipv6Stdout}`);
          
          // If we have IPv6 DNS servers, add them to the output
          if (ipv6Stdout.trim()) {
            if (dnsServers) {
              dnsServers += '\n' + ipv6Stdout.trim();
            } else {
              dnsServers = ipv6Stdout.trim();
            }
            
            // Check IPv6 servers for filtering
            if (!detectedFilterType) {
              const ipv6NormalizedOutput = ipv6Stdout.trim().split(/[\r\n]+/).map(line => line.trim());
              for (const line of ipv6NormalizedOutput) {
                for (const [server, type] of Object.entries(filterServerMap)) {
                  if (line.includes(server)) {
                    console.log(`🔍 Detected filtered DNS in IPv6: ${server} (${type})`);
                    detectedFilterType = type;
                    isFiltered = true;
                    break;
                  }
                }
                if (detectedFilterType) break;
              }
            }
          }
        }
      }
      
      console.log(`🛡️ Is filtered: ${isFiltered}, Filter type: ${detectedFilterType || 'none'}`);
      
      // If we detected a filter type, save it
      if (detectedFilterType) {
        this.saveDetectedFilterType(detectedFilterType);
      }
      
      // If no filter type was detected but DNS is filtered, try to get the last known filter type
      if (isFiltered && !detectedFilterType) {
        detectedFilterType = this.getLastFilterType() || 'unknown';
      }
      
      return {
        success: true,
        currentDNS: dnsServers,
        isFiltered: isFiltered,
        filterType: detectedFilterType
      };
    } catch (error) {
      console.error('❌ DNS check failed:', error);
      
      // Even if the check fails, try to get the last known filter type
      const lastFilterType = this.getLastFilterType();
      
      return {
        success: false,
        error: error.message,
        filterType: lastFilterType
      };
    }
  }

  isFilteredDNS(dnsOutput) {
    if (!dnsOutput) return false;
    
    // Create a map of all filter servers to their respective types
    const filterServerMap = {};
    Object.entries(this.dnsServers).forEach(([type, servers]) => {
      servers.forEach(server => {
        filterServerMap[server] = type;
      });
    });
    
    // Normalize the DNS output (remove whitespace, split into lines)
    const normalizedOutput = dnsOutput.trim().split(/[\r\n]+/).map(line => line.trim());
    
    // Check each line for a match with any filter server
    for (const line of normalizedOutput) {
      for (const [server, type] of Object.entries(filterServerMap)) {
        if (line.includes(server)) {
          console.log(`🔍 Detected filtered DNS: ${server} (${type})`);
          
          // Store the detected filter type for later use
          this.saveDetectedFilterType(type);
          
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Save the detected filter type to a file for persistence
  saveDetectedFilterType(filterType) {
    try {
      const fs = require('fs');
      const path = require('path');
      const { app } = require('electron');
      
      // Create the config directory if it doesn't exist
      const configDir = path.join(app.getPath('userData'), 'config');
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      // Save the filter type to a file
      const configPath = path.join(configDir, 'dns-config.json');
      const config = {
        filterType,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(`💾 Saved detected filter type: ${filterType}`);
    } catch (error) {
      console.error('❌ Failed to save filter type:', error);
    }
  }
  
  // Get the last detected filter type
  getLastFilterType() {
    try {
      const fs = require('fs');
      const path = require('path');
      const { app } = require('electron');
      
      const configPath = path.join(app.getPath('userData'), 'config', 'dns-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log(`📂 Loaded saved filter type: ${config.filterType}`);
        return config.filterType;
      }
    } catch (error) {
      console.error('❌ Failed to load filter type:', error);
    }
    
    return null;
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
        
        // First, disable IPv6 DNS to prevent it from taking precedence
        try {
          const disableIpv6DnsCommand = `netsh interface ipv6 set dns "${interfaceName}" dhcp`;
          console.log(`🛡️ Disabling IPv6 DNS with command: ${disableIpv6DnsCommand}`);
          await execAsync(disableIpv6DnsCommand);
        } catch (ipv6Error) {
          console.log(`⚠️ Could not disable IPv6 DNS: ${ipv6Error.message}`);
        }
        
        // Set primary DNS server
        command = `netsh interface ipv4 set dns "${interfaceName}" static ${servers[0]} primary`;
        console.log(`🛡️ Setting primary DNS with command: ${command}`);
        await execAsync(command);
        
        // Add secondary DNS server if available
        if (servers.length > 1) {
          const secondaryCommand = `netsh interface ipv4 add dns "${interfaceName}" ${servers[1]} index=2`;
          console.log(`🛡️ Adding secondary DNS with command: ${secondaryCommand}`);
          try {
            await execAsync(secondaryCommand);
          } catch (secondaryError) {
            console.log(`⚠️ Could not add secondary DNS: ${secondaryError.message}`);
          }
        }
        
        // Flush DNS cache to ensure changes take effect
        try {
          const flushCommand = `ipconfig /flushdns`;
          console.log(`🧹 Flushing DNS cache with command: ${flushCommand}`);
          await execAsync(flushCommand);
        } catch (flushError) {
          console.log(`⚠️ Could not flush DNS cache: ${flushError.message}`);
        }
      } else if (this.platform === 'darwin') {
        const interfaceName = await this.getActiveInterface();
        command = `networksetup -setdnsservers "${interfaceName}" ${servers.join(' ')}`;
        console.log(`🛡️ Applying DNS filter with command: ${command}`);
        await execAsync(command);
      } else {
        // Linux
        const dnsConfig = servers.map(server => `nameserver ${server}`).join('\n');
        command = `echo "${dnsConfig}" | sudo tee /etc/resolv.conf`;
        console.log(`🛡️ Applying DNS filter with command: ${command}`);
        await execAsync(command);
      }
      
      console.log(`✅ DNS filter applied successfully`);
      
      // Wait a moment for the change to take effect
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verify the change
      const verification = await this.checkCurrentDNS();
      console.log(`🔍 Verification result:`, verification);
      
      // Check if verification shows our DNS servers
      const isVerified = servers.some(server => verification.currentDNS?.includes(server));
      
      if (!isVerified) {
        console.log(`⚠️ DNS verification failed: DNS servers don't match expected values`);
        console.log(`Expected one of: ${servers.join(', ')}`);
        console.log(`Got: ${verification.currentDNS}`);
        
        // Try one more approach with PowerShell if netsh failed
        if (this.platform === 'win32') {
          try {
            console.log(`🔄 Trying alternative PowerShell approach...`);
            const psCommand = `powershell -Command "Set-DnsClientServerAddress -InterfaceAlias '${interfaceName}' -ServerAddresses ('${servers.join("','")}')"`;
            console.log(`🛡️ Applying DNS with PowerShell command: ${psCommand}`);
            await execAsync(psCommand);
            
            // Re-verify
            await new Promise(resolve => setTimeout(resolve, 2000));
            const reVerification = await this.checkCurrentDNS();
            console.log(`🔍 Re-verification result:`, reVerification);
            
            // Update verification result
            verification.currentDNS = reVerification.currentDNS;
            verification.isFiltered = reVerification.isFiltered;
          } catch (psError) {
            console.log(`⚠️ PowerShell approach failed: ${psError.message}`);
          }
        }
      }
      
      return {
        success: true,
        appliedServers: servers,
        filterType,
        verification: verification
      };
    } catch (error) {
      console.error('❌ Failed to apply DNS filter:', error);
      
      // Check if it's a permission error
      if (error.message.includes('Access denied') || error.message.includes('PermissionDenied') || 
          error.message.includes('Access to a CIM resource') || error.message.includes('requires elevation') ||
          error.message.includes('run as administrator')) {
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
        
        // Reset IPv4 DNS to DHCP
        command = `netsh interface ipv4 set dns "${interfaceName}" dhcp`;
        console.log(`🔄 Removing IPv4 DNS filter with command: ${command}`);
        await execAsync(command);
        
        // Also reset IPv6 DNS to DHCP
        try {
          const ipv6Command = `netsh interface ipv6 set dns "${interfaceName}" dhcp`;
          console.log(`🔄 Removing IPv6 DNS filter with command: ${ipv6Command}`);
          await execAsync(ipv6Command);
        } catch (ipv6Error) {
          console.log(`⚠️ Could not reset IPv6 DNS: ${ipv6Error.message}`);
        }
        
        // Flush DNS cache to ensure changes take effect
        try {
          const flushCommand = `ipconfig /flushdns`;
          console.log(`🧹 Flushing DNS cache with command: ${flushCommand}`);
          await execAsync(flushCommand);
        } catch (flushError) {
          console.log(`⚠️ Could not flush DNS cache: ${flushError.message}`);
        }
        
        // Try PowerShell approach as well for thoroughness
        try {
          const psCommand = `powershell -Command "Set-DnsClientServerAddress -InterfaceAlias '${interfaceName}' -ResetServerAddresses"`;
          console.log(`🔄 Also trying PowerShell command: ${psCommand}`);
          await execAsync(psCommand);
        } catch (psError) {
          console.log(`⚠️ PowerShell approach skipped: ${psError.message}`);
        }
      } else if (this.platform === 'darwin') {
        const interfaceName = await this.getActiveInterface();
        command = `networksetup -setdnsservers "${interfaceName}" "Empty"`;
        console.log(`🔄 Removing DNS filter with command: ${command}`);
        await execAsync(command);
      } else {
        // Linux - restore to automatic
        command = 'sudo dhclient -r && sudo dhclient';
        console.log(`🔄 Removing DNS filter with command: ${command}`);
        await execAsync(command);
      }
      
      console.log(`✅ DNS filter removed successfully`);
      
      // Wait a moment for the change to take effect
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verify the change
      const verification = await this.checkCurrentDNS();
      console.log(`🔍 Verification result after removal:`, verification);
      
      return {
        success: true,
        message: 'DNS filter removed, restored to automatic',
        verification: verification
      };
    } catch (error) {
      console.error('❌ Failed to remove DNS filter:', error);
      
      // Check if it's a permission error
      if (error.message.includes('Access denied') || error.message.includes('PermissionDenied') || 
          error.message.includes('requires elevation') || error.message.includes('run as administrator')) {
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
