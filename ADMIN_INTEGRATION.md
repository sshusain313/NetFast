# NetFast Admin Integration

This document outlines the complete admin integration with the backend for the NetFast digital discipline app.

## Overview

The admin dashboard has been fully integrated with the backend API, providing real-time data management, user monitoring, device control, subscription management, violation tracking, analytics, and system settings.

## Backend Components

### 1. Admin Routes (`/backend/routes/admin.js`)

**Endpoints:**
- `GET /api/admin/stats` - Get admin dashboard statistics
- `GET /api/admin/users` - Get users with pagination and search
- `GET /api/admin/users/:userId` - Get user details
- `PATCH /api/admin/users/:userId/status` - Update user status (suspend/activate)
- `GET /api/admin/devices` - Get devices with pagination
- `POST /api/admin/devices/:deviceId/sync` - Force device sync
- `POST /api/admin/devices/:deviceId/disconnect` - Disconnect device
- `GET /api/admin/subscriptions` - Get subscriptions with revenue stats
- `GET /api/admin/violations` - Get violations with filtering
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/settings` - Get system settings
- `PATCH /api/admin/settings` - Update system settings

**Features:**
- Admin authentication middleware
- Pagination support
- Search and filtering
- Real-time data aggregation
- Revenue calculations
- Analytics data processing

### 2. Updated User Model

**New Fields:**
- `name` (required) - User's full name
- `isAdmin` (boolean) - Admin privileges flag
- `status` (enum) - User account status (active/suspended)

### 3. Updated Auth Routes

**Registration Changes:**
- Added `name` field requirement
- First registered user automatically becomes admin
- Returns `isAdmin` status in responses

## Frontend Components

### 1. Admin Hook (`/src/hooks/useAdmin.ts`)

**Features:**
- Centralized admin state management
- API integration for all admin operations
- Pagination handling
- Loading states
- Error handling with toast notifications

**Methods:**
- `fetchStats()` - Get dashboard statistics
- `fetchUsers(page, search)` - Get users with pagination
- `fetchDevices(page, status)` - Get devices with filtering
- `fetchSubscriptions(page, status)` - Get subscriptions
- `fetchViolations(page, severity, timeFilter)` - Get violations
- `fetchAnalytics(period)` - Get analytics data
- `fetchSettings()` - Get system settings
- `updateUserStatus(userId, status)` - Update user status
- `forceDeviceSync(deviceId)` - Force device sync
- `disconnectDevice(deviceId)` - Disconnect device
- `updateSettings(settings)` - Update system settings

### 2. Updated Admin Components

**AdminAnalytics:**
- Real-time charts using backend data
- Dynamic data transformation
- Responsive chart rendering

**AdminUsers:**
- Real user data from backend
- Search functionality
- Pagination
- User status management
- Loading states

**AdminDevices:**
- Real device data from backend
- Device status management
- Force sync functionality
- Disconnect functionality
- Pagination

**AdminSubscriptions:**
- Real subscription data
- Revenue calculations
- Status filtering
- Pagination

**AdminViolations:**
- Real violation data
- Time-based filtering
- Severity filtering
- Statistics calculation
- Pagination

**AdminSettings:**
- Real system settings
- Settings persistence
- System information display
- Save functionality

### 3. Updated API Service

**New Admin Types:**
- `AdminStats` - Dashboard statistics
- `AdminUser` - User data with stats
- `AdminDevice` - Device data with user info
- `AdminSubscription` - Subscription data with user info
- `AdminViolation` - Violation data with user/device info
- `AdminAnalytics` - Analytics data
- `AdminSettings` - System settings
- `SystemInfo` - System information

**New Admin Methods:**
- `getAdminStats()`
- `getAdminUsers(page, limit, search)`
- `getAdminUserDetails(userId)`
- `updateUserStatus(userId, status)`
- `getAdminDevices(page, limit, status)`
- `forceDeviceSync(deviceId)`
- `disconnectDevice(deviceId)`
- `getAdminSubscriptions(page, limit, status)`
- `getAdminViolations(page, limit, severity, timeFilter)`
- `getAdminAnalytics(period)`
- `getAdminSettings()`
- `updateAdminSettings(settings)`

## Setup Instructions

### 1. Backend Setup

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables:**
   Create `.env` file in backend directory:
   ```env
   DATABASE_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   PORT=3001
   NODE_ENV=development
   ```

3. **Create Admin User:**
   ```bash
   node create-admin.js
   ```
   This creates an admin user with:
   - Email: admin@netfast.com
   - Password: admin123456

4. **Start Backend:**
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. **Environment Variables:**
   Create `.env` file in root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_WEBSOCKET_URL=ws://localhost:3001
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

## Usage

### 1. Admin Access

1. Navigate to `/admin` in the application
2. Login with admin credentials
3. Access all admin features

### 2. Admin Features

**Dashboard Overview:**
- Real-time statistics
- System health monitoring
- Quick metrics overview

**User Management:**
- View all users with pagination
- Search users by name/email
- Suspend/activate users
- View user details and statistics

**Device Management:**
- Monitor all registered devices
- View device status and DNS protection
- Force device synchronization
- Disconnect devices remotely

**Subscription Management:**
- View all subscriptions
- Monitor revenue statistics
- Track subscription status
- View payment information

**Violation Tracking:**
- Monitor security violations
- Filter by time period and severity
- View violation statistics
- Take action on violations

**Analytics:**
- User growth charts
- Violation trends
- Subscription distribution
- Revenue analysis

**System Settings:**
- Configure protection policies
- Manage notifications
- System maintenance mode
- Data management operations

## Security Features

1. **Admin Authentication:**
   - JWT-based authentication
   - Admin role verification
   - Secure token handling

2. **Data Protection:**
   - Input validation
   - SQL injection prevention
   - XSS protection

3. **Access Control:**
   - Admin-only endpoints
   - Role-based permissions
   - Secure middleware

## Error Handling

1. **Backend:**
   - Comprehensive error responses
   - Validation error handling
   - Database error handling

2. **Frontend:**
   - Toast notifications for errors
   - Loading states
   - Graceful error recovery

## Performance Optimizations

1. **Pagination:**
   - Efficient data loading
   - Reduced memory usage
   - Better user experience

2. **Caching:**
   - API response caching
   - Optimized data fetching
   - Reduced server load

3. **Real-time Updates:**
   - WebSocket integration
   - Live data updates
   - Efficient communication

## Testing

### Admin User Creation
```bash
cd backend
node create-admin.js
```

### API Testing
Use tools like Postman or curl to test admin endpoints:
```bash
# Get admin stats
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/admin/stats

# Get users
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/admin/users
```

## Troubleshooting

### Common Issues

1. **Admin Access Denied:**
   - Ensure user has `isAdmin: true` in database
   - Check JWT token validity
   - Verify admin middleware

2. **Data Not Loading:**
   - Check backend connection
   - Verify API endpoints
   - Check environment variables

3. **Authentication Issues:**
   - Verify JWT secrets
   - Check token expiration
   - Ensure proper headers

### Debug Mode

Enable debug mode in admin settings for detailed logging and error information.

## Future Enhancements

1. **Advanced Analytics:**
   - Machine learning insights
   - Predictive analytics
   - Custom reporting

2. **Enhanced Security:**
   - Two-factor authentication
   - Audit logging
   - Advanced role management

3. **Real-time Features:**
   - Live violation alerts
   - Real-time user monitoring
   - Instant notifications

4. **API Enhancements:**
   - GraphQL support
   - Webhook integration
   - Third-party integrations

## Support

For issues or questions regarding the admin integration:
1. Check the troubleshooting section
2. Review the API documentation
3. Check server logs for errors
4. Verify database connectivity 