const dnsManager = require('./services/dnsManager');

async function testDNS() {
  console.log('🧪 Testing DNS Manager...\n');
  
  try {
    // Test 1: Check current DNS
    console.log('1. Checking current DNS status...');
    const status = await dnsManager.checkCurrentDNS();
    console.log('Status:', status);
    
    // Test 2: Check if it's filtered
    console.log('\n2. Checking if DNS is filtered...');
    console.log('Is filtered:', status.isFiltered);
    
    // Test 3: Get active interface
    console.log('\n3. Getting active interface...');
    const interface = await dnsManager.getActiveInterface();
    console.log('Active interface:', interface);
    
    console.log('\n✅ DNS tests completed successfully!');
    
  } catch (error) {
    console.error('❌ DNS test failed:', error);
  }
}

testDNS(); 