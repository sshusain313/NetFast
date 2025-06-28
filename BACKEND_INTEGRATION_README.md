# NetFast Backend Integration Guide

## Overview

This guide explains how to set up and use the backend integration features for the NetFast digital discipline app. The integration provides authentication, device management, subscription handling, and real-time communication.

## Features Implemented

### ✅ Authentication System
- User registration and login
- JWT token-based authentication
- Token refresh mechanism
- Protected routes

### ✅ Device Management
- Device registration for desktop app
- Heartbeat monitoring
- Device status tracking
- Platform-specific device tokens

### ✅ Real-time Communication
- WebSocket connections
- Live status updates
- Violation notifications
- Progress milestone alerts

### ✅ Accountability Features
- Spiritual sponsor management
- Violation tracking and reporting
- Progress report generation
- Sponsor notification system

### ✅ Subscription Management
- Subscription tier handling
- Expiration tracking
- Renewal reminders
- Tier-based feature access

## Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

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

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Start Electron App (Optional)

```bash
cd electron
npm run electron-dev
```

## Authentication Flow

### 1. User Registration
- Navigate to `/login`
- Switch to "Create Account" tab
- Fill in email, password, and subscription tier
- Account is created and user is automatically logged in

### 2. User Login
- Navigate to `/login`
- Enter email and password
- User is authenticated and redirected to dashboard

### 3. Protected Routes
- All routes except `/login` require authentication
- Unauthenticated users are redirected to login
- Authentication state is persisted across sessions

## Device Management

### Desktop App Integration

The Electron app automatically:
1. Generates a unique device token on startup
2. Registers with the backend when user is authenticated
3. Sends heartbeat every 30 seconds
4. Reports DNS protection status
5. Logs violation attempts

### Device Registration Process

```typescript
// Device is automatically registered when user logs in
const { registerCurrentDevice } = useDeviceManagement();

// Device sends heartbeat with DNS status
const { sendHeartbeat } = useDeviceManagement();
await sendHeartbeat({
  deviceId: currentDevice.id,
  dnsStatus: isProtected
});
```

## Real-time Features

### WebSocket Connection

The app automatically connects to WebSocket when authenticated:

```typescript
// WebSocket provides real-time updates
const { isConnected, lastMessage } = useWebSocket();

// Handle different message types
switch (lastMessage?.type) {
  case 'violation':
    // Show violation notification
    break;
  case 'device_status':
    // Update device status
    break;
  case 'subscription_update':
    // Handle subscription changes
    break;
}
```

### Message Types

- **Violation**: DNS bypass attempts detected
- **Device Status**: Device online/offline status
- **Subscription Update**: Subscription changes
- **Sponsor Notification**: Messages from spiritual sponsors
- **Progress Update**: Milestone achievements

## Accountability System

### Spiritual Sponsor Management

```typescript
const { sponsors, setSpiritualSponsor, removeSponsor } = useAccountability();

// Add a new sponsor
await setSpiritualSponsor({
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  relationship: "Mentor",
  isActive: true
});

// Remove a sponsor
await removeSponsor(sponsorId);
```

### Violation Tracking

```typescript
const { notifyViolationAttempt } = useAccountability();

// Report violation attempt
await notifyViolationAttempt("dns_bypass_attempt", deviceId);
```

### Progress Reports

```typescript
const { sendProgressReport } = useAccountability();

// Send progress report
await sendProgressReport({
  daysCompleted: 30,
  totalDays: 40,
  violationCount: 2,
  strengthMoments: ["Resisted temptation", "Focused on prayer"]
});
```

## API Service Usage

### Making API Calls

```typescript
import apiService from '@/services/api';

// Get user subscription
const response = await apiService.getSubscription();
if (response.success) {
  console.log(response.data);
}

// Create spiritual sponsor
const sponsorResponse = await apiService.createSponsor({
  name: "John Doe",
  email: "john@example.com",
  relationship: "Mentor",
  isActive: true
});
```

### Error Handling

```typescript
const response = await apiService.login(email, password);
if (!response.success) {
  toast.error(response.error || 'Login failed');
  return;
}
```

## Hooks Usage

### Authentication Hook

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();

if (isAuthenticated) {
  console.log('User:', user.email);
}
```

### Device Management Hook

```typescript
import { useDeviceManagement } from '@/hooks/useDeviceManagement';

const { 
  devices, 
  currentDevice, 
  isElectron, 
  registerCurrentDevice 
} = useDeviceManagement();

if (isElectron && !currentDevice) {
  await registerCurrentDevice();
}
```

### Accountability Hook

```typescript
import { useAccountability } from '@/hooks/useAccountability';

const { 
  sponsors, 
  progressReports, 
  setSpiritualSponsor,
  notifyViolationAttempt 
} = useAccountability();
```

## Backend Requirements

### Required Endpoints

The backend must implement these endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `POST /devices` - Device registration
- `GET /devices` - Get user devices
- `POST /devices/:id/heartbeat` - Device heartbeat
- `GET /subscriptions/current` - Get user subscription
- `PUT /subscriptions` - Update subscription
- `GET /sponsors` - Get spiritual sponsors
- `POST /sponsors` - Create sponsor
- `PUT /sponsors/:id` - Update sponsor
- `DELETE /sponsors/:id` - Delete sponsor
- `POST /violations` - Report violation
- `GET /violations` - Get violations
- `GET /reports` - Get progress reports
- `POST /reports` - Create progress report

### WebSocket Support

The backend must support WebSocket connections at `ws://localhost:3001/ws` with JWT token authentication.

### Database Schema

The backend should use MongoDB with these collections:
- `users` - User accounts
- `devices` - Registered devices
- `subscriptions` - User subscriptions
- `sponsors` - Spiritual sponsors
- `violations` - Violation attempts
- `progress_reports` - Progress reports

## Security Features

### JWT Authentication
- Secure token-based authentication
- Automatic token refresh
- Token invalidation on logout

### Device Security
- Unique device tokens
- Platform-specific identification
- Heartbeat monitoring

### Input Validation
- Form validation with Zod
- API request validation
- XSS protection

### Rate Limiting
- API rate limiting (backend implementation)
- Request throttling
- Abuse prevention

## Development Workflow

### 1. Local Development
```bash
# Start frontend
npm run dev

# Start backend (separate process)
# Backend should run on http://localhost:3001

# Start Electron (optional)
cd electron && npm run electron-dev
```

### 2. Testing Authentication
1. Navigate to `/login`
2. Create a new account
3. Verify protected routes work
4. Test logout functionality

### 3. Testing Device Integration
1. Start Electron app
2. Login with account
3. Verify device registration
4. Check heartbeat functionality

### 4. Testing Real-time Features
1. Ensure WebSocket connection
2. Test violation reporting
3. Verify sponsor notifications
4. Check progress updates

## Troubleshooting

### Common Issues

1. **Authentication Fails**
   - Check backend is running
   - Verify API base URL in `.env`
   - Check network connectivity

2. **WebSocket Connection Fails**
   - Verify WebSocket URL in `.env`
   - Check JWT token validity
   - Ensure backend supports WebSocket

3. **Device Registration Fails**
   - Check if running in Electron
   - Verify device token generation
   - Check backend device endpoint

4. **Real-time Updates Not Working**
   - Check WebSocket connection status
   - Verify message format
   - Check backend WebSocket implementation

### Debug Mode

Enable debug logging by setting:
```env
VITE_DEV_MODE=true
```

### Network Issues

If backend is not accessible:
1. Check backend server status
2. Verify CORS configuration
3. Check firewall settings
4. Test API endpoints directly

## Production Deployment

### Environment Variables

For production, update environment variables:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_WEBSOCKET_URL=wss://your-backend-domain.com/ws
VITE_DEV_MODE=false
```

### Security Considerations

1. Use HTTPS in production
2. Implement proper CORS
3. Set secure JWT secrets
4. Enable rate limiting
5. Monitor API usage
6. Implement logging

### Performance Optimization

1. Enable caching
2. Optimize database queries
3. Implement connection pooling
4. Use CDN for static assets
5. Monitor WebSocket connections

## Support

For issues or questions:
1. Check the API documentation in `BACKEND_API.md`
2. Review the troubleshooting section
3. Check browser console for errors
4. Verify backend logs
5. Test API endpoints directly

## Next Steps

1. **Backend Implementation**: Implement the backend API endpoints
2. **Database Setup**: Set up MongoDB with required collections
3. **WebSocket Server**: Implement WebSocket server for real-time updates
4. **Email/SMS Integration**: Add sponsor notification services
5. **Payment Processing**: Integrate Stripe for subscription management
6. **Analytics**: Add usage analytics and reporting
7. **Mobile App**: Extend to mobile platforms
8. **Advanced Features**: Add AI-powered insights and recommendations 