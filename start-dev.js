const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting NetFast Development Environment...\n');

// Function to start a process
function startProcess(name, command, args, cwd) {
  console.log(`📦 Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd: cwd || process.cwd(),
    stdio: 'inherit',
    shell: true
  });

  process.on('error', (error) => {
    console.error(`❌ Error starting ${name}:`, error);
  });

  process.on('close', (code) => {
    console.log(`🔚 ${name} process exited with code ${code}`);
  });

  return process;
}

// Start backend server
const backendProcess = startProcess('Backend Server', 'npm', ['run', 'dev'], path.join(__dirname, 'backend'));

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  console.log('\n⏳ Backend starting, waiting 3 seconds...\n');
  
  setTimeout(() => {
    const frontendProcess = startProcess('Frontend Server', 'npm', ['run', 'dev']);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development servers...');
      backendProcess.kill('SIGINT');
      frontendProcess.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down development servers...');
      backendProcess.kill('SIGTERM');
      frontendProcess.kill('SIGTERM');
      process.exit(0);
    });
    
  }, 3000);
  
}, 1000);

console.log('\n📋 Development servers will be available at:');
console.log('   🌐 Frontend: http://localhost:8080');
console.log('   🔧 Backend:  http://localhost:3001');
console.log('   📡 WebSocket: ws://localhost:3001/ws');
console.log('\n💡 Press Ctrl+C to stop all servers\n'); 