# NetFast Startup Guide

This guide will help you start both the backend server and frontend application for the NetFast digital discipline app.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (already configured)

## Quick Start (Recommended)

### Option 1: Automatic Startup Script

1. **Install dependencies for both frontend and backend:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

2. **Set up environment variables:**
   ```bash
   # Copy frontend environment file
   cp env.example .env
   
   # Copy backend environment file
   cp backend/env.backend backend/.env
   ```

3. **Start both servers automatically:**
   ```bash
   node start-dev.js
   ```

This will start both the backend (port 3001) and frontend (port 8080) servers concurrently.

## Manual Startup

### Step 1: Backend Server Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the environment file
   cp env.backend .env
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend server will start on `http://localhost:3001`

### Step 2: Frontend Server Setup

1. **Open a new terminal and navigate to the root directory:**
   ```bash
   cd NetFast
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the environment file
   cp env.example .env
   ```

4. **Start the frontend server:**
   ```bash
   npm run dev
   ```

   The frontend server will start on `http://localhost:8080`

## Environment Configuration

### Frontend Environment (.env)

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WEBSOCKET_URL=ws://localhost:3001/ws

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_MOCK_DATA=false

# Feature Flags
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_DEVICE_MONITORING=true
VITE_ENABLE_VIOLATION_TRACKING=true
```

### Backend Environment (backend/.env)

```env
# Database Configuration
DATABASE_URL=mongodb+srv://shabahatsyed101:8flCr5MKAfy15JpW@cluster0.w8cgqlr.mongodb.net/fast

# JWT Configuration
JWT_SECRET=netfast_super_secret_jwt_key_2024_secure_and_unique
JWT_REFRESH_SECRET=netfast_refresh_token_secret_2024_very_secure

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Verification

### 1. Check Backend Health

Visit `http://localhost:3001/api/health` in your browser or use curl:

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### 2. Check Frontend

Visit `http://localhost:8080` in your browser. You should see:
- The NetFast login page
- Beautiful spiritual-themed UI
- Authentication forms

### 3. Test Authentication

1. Click "Create Account" tab
2. Fill in the registration form
3. Choose a subscription tier
4. Submit the form

You should be redirected to the main dashboard after successful registration.

## Troubleshooting

### Backend Issues

1. **Port already in use:**
   ```bash
   # Find process using port 3001
   lsof -i :3001
   
   # Kill the process
   kill -9 <PID>
   ```

2. **MongoDB connection failed:**
   - Check your internet connection
   - Verify the MongoDB URI in `backend/.env`
   - Ensure the MongoDB cluster is active

3. **JWT secret not set:**
   - Make sure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set in `backend/.env`

### Frontend Issues

1. **Port already in use:**
   ```bash
   # Find process using port 8080
   lsof -i :8080
   
   # Kill the process
   kill -9 <PID>
   ```

2. **API connection failed:**
   - Ensure backend is running on port 3001
   - Check `VITE_API_BASE_URL` in `.env`
   - Verify CORS settings in backend

3. **WebSocket connection failed:**
   - Ensure backend is running
   - Check `VITE_WEBSOCKET_URL` in `.env`
   - Verify WebSocket server is active

### Common Solutions

1. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Clear browser cache:**
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser cache and cookies

3. **Check logs:**
   - Backend logs will show in the terminal
   - Frontend logs will show in browser console (F12)

## Development Workflow

### 1. Start Development Environment

```bash
# Option 1: Automatic (recommended)
node start-dev.js

# Option 2: Manual
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 2. Make Changes

- Frontend changes will auto-reload
- Backend changes will auto-restart (with nodemon)

### 3. Test Features

1. **Authentication:**
   - Register new account
   - Login/logout
   - Protected routes

2. **Device Management:**
   - Start Electron app
   - Verify device registration
   - Check heartbeat functionality

3. **Real-time Features:**
   - WebSocket connection
   - Live notifications
   - Status updates

### 4. Stop Servers

```bash
# If using automatic startup
Ctrl+C

# If using manual startup
# Press Ctrl+C in each terminal
```

## Production Deployment

For production deployment:

1. **Update environment variables:**
   ```env
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   VITE_WEBSOCKET_URL=wss://your-backend-domain.com/ws
   NODE_ENV=production
   ```

2. **Build frontend:**
   ```bash
   npm run build
   ```

3. **Start backend in production:**
   ```bash
   cd backend
   npm start
   ```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs in terminal and browser console
3. Verify all environment variables are set correctly
4. Ensure MongoDB is accessible
5. Check network connectivity

## Next Steps

Once both servers are running:

1. **Test the complete flow:**
   - Register a new account
   - Login and explore the dashboard
   - Test device registration (if using Electron)
   - Verify real-time features

2. **Explore the features:**
   - Spiritual sponsor management
   - Progress tracking
   - Violation monitoring
   - Subscription management

3. **Customize the application:**
   - Modify UI components
   - Add new features
   - Configure additional settings

Happy coding! 🚀 