# NetFast Electron Setup Guide

## Quick Start

### Option 1: Automatic Startup (Recommended)
```bash
# From the root directory
npm run electron-start
```

This will automatically start the backend, frontend, and Electron in the correct order.

### Option 2: Manual Startup
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend  
npm run dev

# Terminal 3: Start Electron (after frontend is ready)
cd electron
npm run electron
```

### Option 3: Concurrent Startup
```bash
# From the root directory
npm run electron-dev
```

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** running locally or accessible via connection string
3. **Backend dependencies** installed:
   ```bash
   cd backend
   npm install
   ```
4. **Frontend dependencies** installed:
   ```bash
   npm install
   ```
5. **Electron dependencies** installed:
   ```bash
   cd electron
   npm install
   ```

## Environment Setup

### Backend Environment
Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### Frontend Environment
Create `.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## Development Workflow

1. **Start the full stack**:
   ```bash
   npm run electron-start
   ```

2. **Make changes** to React components in `src/`

3. **Changes will hot-reload** automatically in both browser and Electron

4. **For backend changes**, restart the backend process

## Production Build

### Build Frontend
```bash
npm run build
```

### Package Electron App
```bash
cd electron
npm run build
```

## Troubleshooting

### "ERR_FILE_NOT_FOUND" Error
- **Cause**: Electron trying to load from `dist/` instead of development server
- **Solution**: Make sure frontend is running on `http://localhost:8080`

### "Development Server Not Found" Dialog
- **Cause**: Frontend development server not running
- **Solution**: Start frontend with `npm run dev` first

### Backend Connection Issues
- **Check**: MongoDB is running and accessible
- **Check**: Backend environment variables are set correctly
- **Check**: Backend is running on port 3000

### Electron Not Starting
- **Check**: All dependencies are installed
- **Check**: Node.js version is compatible
- **Check**: No other processes using required ports

### Permission Issues (DNS/Network Features)
- **Windows**: Run as Administrator
- **macOS**: Grant accessibility permissions
- **Linux**: Use sudo or configure polkit rules

## Verification

1. **Backend**: Check `http://localhost:3000/health`
2. **Frontend**: Check `http://localhost:8080`
3. **Electron**: App should open with full functionality
4. **Database**: Check MongoDB connection in backend logs

## Features Available in Electron

- ✅ **User Authentication** (login/register)
- ✅ **Device Registration** and monitoring
- ✅ **DNS Protection** (requires admin privileges)
- ✅ **Accountability Features** (spiritual sponsor notifications)
- ✅ **Real-time Updates** via WebSocket
- ✅ **Admin Dashboard** (if user has admin role)
- ✅ **Subscription Management**
- ✅ **Violation Tracking**

## Development Tips

- **Hot Reload**: Changes to React components update immediately
- **DevTools**: Press F12 or Cmd+Option+I to open developer tools
- **Logs**: Check terminal output for backend and Electron logs
- **Database**: Use MongoDB Compass or similar to inspect data
- **Network**: Use browser dev tools to monitor API calls

## Security Notes

- **Admin Features**: Require proper authentication and role verification
- **DNS Changes**: Require system administrator privileges
- **Device Tokens**: Generated uniquely per device installation
- **JWT Tokens**: Include device-specific claims for security

## File Structure

```
NetFast/
├── src/                    # React frontend
├── backend/               # Express backend
├── electron/              # Electron app
│   ├── main.js           # Main process
│   ├── preload.js        # Preload script
│   └── services/         # Electron services
└── package.json          # Root package.json
```

## Environment Variables

Make sure these files exist:
- `backend/env.backend` - Backend environment variables
- `.env` - Frontend environment variables (optional)

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify all services are running on correct ports
3. Ensure all dependencies are installed
4. Check the network tab for API errors

## Quick Start Commands

```bash
# Complete setup (run from root directory)
npm install
cd backend && npm install && cd ..
cd electron && npm install && cd ..

# Start everything
npm run electron-dev
``` 