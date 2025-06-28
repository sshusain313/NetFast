# NetFast Backend API Integration

## Overview

This document outlines the backend API integration for the NetFast digital discipline app. The backend provides authentication, device management, subscription handling, and real-time communication features.

## Base URL

```
http://localhost:3001/api
```

## Authentication

All API requests (except login/register) require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "subscription_tier": "Digital Seeker"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "subscription_tier": "Digital Seeker",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### POST /auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "subscription_tier": "Digital Seeker",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### POST /auth/refresh
Refresh JWT token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refresh_token": "new_refresh_token"
  }
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

**Response:**
```json
{
  "success": true
}
```

### Device Management

#### POST /devices
Register a new device.

**Request Body:**
```json
{
  "device_token": "device_token",
  "platform": "win32"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "device_id",
    "user_id": "user_id",
    "device_token": "device_token",
    "last_heartbeat": "2024-01-01T00:00:00Z",
    "dns_status": true,
    "platform": "win32",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /devices
Get all user devices.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "device_id",
      "user_id": "user_id",
      "device_token": "device_token",
      "last_heartbeat": "2024-01-01T00:00:00Z",
      "dns_status": true,
      "platform": "win32",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /devices/:id/heartbeat
Send heartbeat for device status.

**Request Body:**
```json
{
  "dns_status": true
}
```

**Response:**
```json
{
  "success": true
}
```

### Subscription Management

#### GET /subscriptions/current
Get current user subscription.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "subscription_id",
    "user_id": "user_id",
    "tier": "Digital Seeker",
    "expires_at": "2024-12-31T23:59:59Z",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /subscriptions
Update user subscription.

**Request Body:**
```json
{
  "tier": "Spiritual Practitioner"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "subscription_id",
    "user_id": "user_id",
    "tier": "Spiritual Practitioner",
    "expires_at": "2024-12-31T23:59:59Z",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Spiritual Sponsor Management

#### GET /sponsors
Get all user spiritual sponsors.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sponsor_id",
      "user_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "relationship": "Mentor",
      "isActive": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /sponsors
Create new spiritual sponsor.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "relationship": "Mentor",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sponsor_id",
    "user_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "relationship": "Mentor",
    "isActive": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /sponsors/:id
Update spiritual sponsor.

**Request Body:**
```json
{
  "name": "John Smith",
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sponsor_id",
    "user_id": "user_id",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567890",
    "relationship": "Mentor",
    "isActive": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /sponsors/:id
Delete spiritual sponsor.

**Response:**
```json
{
  "success": true
}
```

### Violation Tracking

#### POST /violations
Report a violation attempt.

**Request Body:**
```json
{
  "device_id": "device_id",
  "type": "dns_bypass_attempt",
  "details": "User attempted to access blocked content"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "violation_id",
    "device_id": "device_id",
    "type": "dns_bypass_attempt",
    "timestamp": "2024-01-01T00:00:00Z",
    "details": "User attempted to access blocked content"
  }
}
```

#### GET /violations
Get all user violations.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "violation_id",
      "device_id": "device_id",
      "type": "dns_bypass_attempt",
      "timestamp": "2024-01-01T00:00:00Z",
      "details": "User attempted to access blocked content"
    }
  ]
}
```

### Progress Reports

#### GET /reports
Get all user progress reports.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "report_id",
      "user_id": "user_id",
      "days_completed": 30,
      "violation_count": 2,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /reports
Create new progress report.

**Request Body:**
```json
{
  "days_completed": 30,
  "violation_count": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "report_id",
    "user_id": "user_id",
    "days_completed": 30,
    "violation_count": 2,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## WebSocket API

### Connection

Connect to WebSocket with authentication:

```
ws://localhost:3001/ws?token=<jwt_token>
```

### Message Types

#### Violation Notification
```json
{
  "type": "violation",
  "data": {
    "device_id": "device_id",
    "violation_type": "dns_bypass_attempt",
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Device Status Update
```json
{
  "type": "device_status",
  "data": {
    "device_id": "device_id",
    "status": "online|offline",
    "dns_status": true
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Subscription Update
```json
{
  "type": "subscription_update",
  "data": {
    "status": "expired|renewed",
    "tier": "Digital Seeker",
    "expires_at": "2024-12-31T23:59:59Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Sponsor Notification
```json
{
  "type": "sponsor_notification",
  "data": {
    "sponsor_id": "sponsor_id",
    "message": "Keep up the good work!",
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Progress Update
```json
{
  "type": "progress_update",
  "data": {
    "milestone": "30_days",
    "days_completed": 30,
    "achievement": "First month completed!"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  subscription_tier: 'Digital Seeker' | 'Spiritual Practitioner' | 'Digital Master';
  created_at: string;
}
```

### Device
```typescript
interface Device {
  id: string;
  user_id: string;
  device_token: string;
  last_heartbeat: string;
  dns_status: boolean;
  platform: string;
  created_at: string;
}
```

### Subscription
```typescript
interface Subscription {
  id: string;
  user_id: string;
  tier: 'Digital Seeker' | 'Spiritual Practitioner' | 'Digital Master';
  expires_at: string;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
}
```

### SpiritualSponsor
```typescript
interface SpiritualSponsor {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  isActive: boolean;
  created_at: string;
}
```

### Violation
```typescript
interface Violation {
  id: string;
  device_id: string;
  type: string;
  timestamp: string;
  details: string;
}
```

### ProgressReport
```typescript
interface ProgressReport {
  id: string;
  user_id: string;
  days_completed: number;
  violation_count: number;
  created_at: string;
}
```

## Error Handling

All API responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional error details"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Considerations

1. **JWT Tokens**: All authenticated requests require valid JWT tokens
2. **Rate Limiting**: Implement rate limiting on sensitive endpoints
3. **Input Validation**: Validate and sanitize all input data
4. **CORS**: Configure CORS for web client access
5. **HTTPS**: Use HTTPS in production
6. **Token Refresh**: Implement automatic token refresh
7. **Device Authentication**: Use device-specific tokens for desktop app

## Implementation Notes

1. **MongoDB Integration**: Use the provided MongoDB URI for data persistence
2. **JWT Secret**: Generate a secure JWT secret for token signing
3. **WebSocket Authentication**: Validate JWT tokens in WebSocket connections
4. **Heartbeat Monitoring**: Implement device status monitoring via heartbeats
5. **Violation Tracking**: Log and track all violation attempts
6. **Sponsor Notifications**: Implement email/SMS notifications for sponsors
7. **Progress Analytics**: Generate insights from user progress data

## Environment Variables

Required backend environment variables:

```env
DATABASE_URL=mongodb+srv://shabahatsyed101:8flCr5MKAfy15JpW@cluster0.w8cgqlr.mongodb.net/fast
JWT_SECRET=your_secure_jwt_secret_here
JWT_REFRESH_SECRET=your_secure_refresh_secret_here
PORT=3001
NODE_ENV=development
```

Optional environment variables:

```env
STRIPE_SECRET_KEY=sk_test_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
``` 