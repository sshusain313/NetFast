const dnsManager = require('./services/dnsManager');

async function showDNSInfo() {
  console.log('🛡️ NetFast DNS Configuration\n');
  
  // Show available DNS providers
  console.log('📋 Available DNS Providers:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  Object.entries(dnsManager.dnsServers).forEach(([provider, servers]) => {
    console.log(`\n🔸 ${provider.toUpperCase()}:`);
    console.log(`   Primary:   ${servers[0]}`);
    console.log(`   Secondary: ${servers[1]}`);
    
    if (provider === 'opendns') {
      console.log(`   Filter:    Family Shield (adult content + malware)`);
      console.log(`   Speed:     Good`);
    } else if (provider === 'cleanBrowsing') {
      console.log(`   Filter:    Adult content filtering`);
      console.log(`   Speed:     Excellent`);
    } else if (provider === 'cloudflareFamily') {
      console.log(`   Filter:    Family protection`);
      console.log(`   Speed:     Very Fast`);
    }
  });
  
  console.log('\n🔍 Current DNS Status:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const status = await dnsManager.checkCurrentDNS();
    console.log(`Status: ${status.success ? '✅ Success' : '❌ Failed'}`);
    console.log(`Current DNS: ${status.currentDNS || 'Not detected'}`);
    console.log(`Is Filtered: ${status.isFiltered ? '✅ Yes' : '❌ No'}`);
    
    if (status.isFiltered) {
      // Determine which provider is being used
      const allServers = [
        ...dnsManager.dnsServers.opendns,
        ...dnsManager.dnsServers.cleanBrowsing,
        ...dnsManager.dnsServers.cloudflareFamily
      ];
      
      for (const [provider, servers] of Object.entries(dnsManager.dnsServers)) {
        if (servers.some(server => status.currentDNS.includes(server))) {
          console.log(`Active Provider: ${provider.toUpperCase()}`);
          break;
        }
      }
    } else {
      console.log('Active Provider: None (using default DNS)');
    }
    
  } catch (error) {
    console.error('❌ Failed to check DNS status:', error.message);
  }
  
  console.log('\n💡 Recommendations:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('• OpenDNS: Good balance of speed and filtering');
  console.log('• CleanBrowsing: Strongest adult content filtering');
  console.log('• Cloudflare: Fastest performance with family protection');
  console.log('\nTo change DNS provider, use the dropdown in the Settings page!');
}

showDNSInfo(); 