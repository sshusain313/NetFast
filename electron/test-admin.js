const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function testAdminPrivileges() {
  console.log('🧪 Testing Admin Privileges...\n');
  
  try {
    // Test 1: Check if we have admin privileges
    console.log('1. Checking admin privileges...');
    try {
      await execAsync('net session');
      console.log('✅ Admin privileges confirmed');
    } catch (error) {
      console.log('❌ Admin privileges not available:', error.message);
    }
    
    // Test 2: Try to get network adapters (requires admin on some systems)
    console.log('\n2. Testing network adapter access...');
    try {
      const { stdout } = await execAsync('Get-NetAdapter | Where-Object {$_.Status -eq \'Up\'}');
      console.log('✅ Network adapters accessible');
      console.log('Adapters:', stdout.trim());
    } catch (error) {
      console.log('❌ Network adapter access failed:', error.message);
    }
    
    // Test 3: Check current DNS
    console.log('\n3. Testing DNS access...');
    try {
      const { stdout } = await execAsync('ipconfig /all | findstr "DNS Servers"');
      console.log('✅ DNS information accessible');
      console.log('DNS:', stdout.trim());
    } catch (error) {
      console.log('❌ DNS access failed:', error.message);
    }
    
    console.log('\n✅ Admin privileges tests completed!');
    
  } catch (error) {
    console.error('❌ Admin privileges test failed:', error);
  }
}

testAdminPrivileges(); 