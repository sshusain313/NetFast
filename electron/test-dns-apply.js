const dnsManager = require('./services/dnsManager');

async function testDNSApply() {
  console.log('🧪 Testing DNS Filter Application...\n');
  
  try {
    // Test 1: Check current DNS
    console.log('1. Checking current DNS status...');
    const status = await dnsManager.checkCurrentDNS();
    console.log('Current status:', status);
    
    // Test 2: Apply DNS filter
    console.log('\n2. Applying OpenDNS filter...');
    const applyResult = await dnsManager.applyDNSFilter('opendns');
    console.log('Apply result:', applyResult);
    
    // Test 3: Check DNS again
    console.log('\n3. Checking DNS after application...');
    const newStatus = await dnsManager.checkCurrentDNS();
    console.log('New status:', newStatus);
    
    // Test 4: Remove DNS filter
    console.log('\n4. Removing DNS filter...');
    const removeResult = await dnsManager.removeDNSFilter();
    console.log('Remove result:', removeResult);
    
    // Test 5: Final check
    console.log('\n5. Final DNS check...');
    const finalStatus = await dnsManager.checkCurrentDNS();
    console.log('Final status:', finalStatus);
    
    console.log('\n✅ DNS filter application test completed!');
    
  } catch (error) {
    console.error('❌ DNS test failed:', error);
  }
}

testDNSApply(); 