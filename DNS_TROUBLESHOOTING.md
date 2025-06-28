# DNS Filtering Troubleshooting Guide

## Common Issues and Solutions

### 1. Toggle Button Not Working

**Symptoms:**
- Toggle button doesn't respond when clicked
- No error messages appear
- Status doesn't update

**Solutions:**
1. **Check if running in Electron:**
   - Open browser dev tools (F12)
   - Check console for "Not running in Electron environment" error
   - Make sure you're using the Electron app, not the browser

2. **Check Electron logs:**
   - Look for DNS-related log messages in the terminal
   - Should see: "🔍 Checking DNS status...", "📡 DNS Status result:", etc.

3. **Verify preload script:**
   - Check that `electron/preload.js` exposes `electronAPI`
   - Verify IPC handlers are registered in `electron/main.js`

### 2. Admin Privileges Required

**Symptoms:**
- Error: "Admin privileges required"
- DNS changes fail to apply
- Error: "options.name must be alphanumeric only"

**Solutions:**
1. **Run Electron as Administrator:**
   - Right-click Electron app
   - Select "Run as administrator"

2. **Windows UAC Settings:**
   - Temporarily disable UAC for testing
   - Or configure UAC to allow the app

3. **Manual DNS Change:**
   - Open Network Settings
   - Change DNS manually to test if it works

4. **Fixed in Latest Version:**
   - The app now skips admin checks on Windows
   - DNS operations will fail naturally if admin privileges are needed
   - Better error messages guide users to run as administrator

### 3. DNS Status Not Detecting Correctly

**Symptoms:**
- Shows "Unprotected" when DNS is actually filtered
- Shows "Protected" when DNS is not filtered

**Solutions:**
1. **Check DNS detection logic:**
   - The app looks for specific DNS servers:
     - OpenDNS: 208.67.222.222, 208.67.220.220
     - CleanBrowsing: 185.228.168.168, 185.228.169.168
     - Cloudflare Family: 1.1.1.3, 1.0.0.3

2. **Verify current DNS:**
   - Open Command Prompt
   - Run: `ipconfig /all | findstr "DNS Servers"`
   - Check if the servers match the filtered ones

3. **Test DNS detection:**
   ```bash
   cd electron
   node test-dns.js
   ```

### 4. Network Interface Issues

**Symptoms:**
- Error: "Could not determine active network interface"
- DNS changes fail to apply

**Solutions:**
1. **Check network adapters:**
   - Open PowerShell as Administrator
   - Run: `Get-NetAdapter | Where-Object {$_.Status -eq 'Up'}`
   - Verify interface names

2. **Manual interface selection:**
   - Edit `electron/services/dnsManager.js`
   - Hardcode the interface name for testing

### 5. PowerShell Execution Policy

**Symptoms:**
- PowerShell commands fail
- "Execution policy" errors

**Solutions:**
1. **Check execution policy:**
   ```powershell
   Get-ExecutionPolicy
   ```

2. **Set execution policy:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### 6. DNS Changes Not Persisting

**Symptoms:**
- DNS changes revert after restart
- Changes only apply temporarily

**Solutions:**
1. **Check DHCP settings:**
   - Network adapter might be set to "Obtain DNS automatically"
   - Change to "Use the following DNS server addresses"

2. **Group Policy:**
   - Check if Group Policy is overriding DNS settings
   - Run: `gpresult /r` to check policies

## Debug Steps

### 1. Enable Debug Mode
The app shows debug information in development mode:
- Look for the blue "Debug Info" box in Settings
- Check console logs for detailed information

### 2. Test DNS Commands Manually
```bash
# Check current DNS
ipconfig /all | findstr "DNS Servers"

# Get network adapters
Get-NetAdapter | Where-Object {$_.Status -eq 'Up'}

# Test DNS change (run as admin)
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ServerAddresses "208.67.222.222","208.67.220.220"
```

### 3. Check Electron Logs
Look for these log messages:
- `🔍 Checking DNS status...`
- `📡 DNS Status result:`
- `🛡️ Applying DNS filter:`
- `✅ DNS filter applied successfully`

### 4. Verify IPC Communication
Check that these IPC handlers are working:
- `check-dns-status`
- `apply-dns-filter`
- `remove-dns-filter`
- `request-admin-privileges`

## Testing DNS Filtering

### 1. Test with Known Sites
Try accessing these sites to verify filtering:
- `pornhub.com` (should be blocked)
- `facebook.com` (might be blocked depending on filter)
- `google.com` (should work)

### 2. Check DNS Resolution
```bash
# Test DNS resolution
nslookup pornhub.com
nslookup google.com
```

### 3. Verify Filter Lists
The app uses these DNS providers:
- **OpenDNS**: Family Shield
- **CleanBrowsing**: Adult filter
- **Cloudflare**: Family protection

## Getting Help

If you're still having issues:

1. **Collect debug information:**
   - Screenshot of the Settings page
   - Console logs from Electron
   - Output of `node test-dns.js`

2. **Check system requirements:**
   - Windows 10/11
   - Administrator privileges
   - Active internet connection

3. **Try alternative methods:**
   - Manual DNS configuration
   - Different DNS providers
   - Browser extensions as backup

## Common Error Messages

- **"Not running in Electron environment"**: Use Electron app, not browser
- **"Admin privileges required"**: Run as administrator
- **"Could not determine active network interface"**: Check network adapters
- **"Failed to apply DNS filter"**: Check PowerShell execution policy
- **"DNS check failed"**: Verify network connectivity 