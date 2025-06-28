const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting NetFast Electron App...\n');

// Start backend
console.log('📡 Starting backend...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit for backend to start
setTimeout(() => {
  // Start frontend
  console.log('🌐 Starting frontend...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Wait for frontend to be ready
  setTimeout(() => {
    console.log('🖥️  Starting Electron...');
    const electron = spawn('npm', ['run', 'electron'], {
      cwd: path.join(__dirname, 'electron'),
      stdio: 'inherit',
      shell: true
    });

    // Handle process cleanup
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      backend.kill();
      frontend.kill();
      electron.kill();
      process.exit();
    });
  }, 3000); // Wait 3 seconds for frontend to start
}, 2000); // Wait 2 seconds for backend to start 