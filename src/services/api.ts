import { toast } from 'sonner';

// Types for API integration
export interface User {
  id: string;
  email: string;
  name: string;
  subscription_tier: 'Digital Seeker' | 'Spiritual Practitioner' | 'Digital Master';
  isAdmin: boolean;
  created_at: string;
}

export interface Device {
  id: string;
  user_id: string;
  device_token: string;
  last_heartbeat: string;
  dns_status: boolean;
  platform: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'Digital Seeker' | 'Spiritual Practitioner' | 'Digital Master';
  expires_at: string;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
}

export interface SpiritualSponsor {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  isActive: boolean;
  created_at: string;
}

export interface Violation {
  id: string;
  device_id: string;
  type: string;
  timestamp: string;
  details: string;
}

export interface ProgressReport {
  id: string;
  user_id: string;
  days_completed: number;
  violation_count: number;
  created_at: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  devicesOnline: number;
  violationsToday: number;
  revenue: number;
  systemHealth: number;
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  subscription_tier: string;
  status: string;
  devices: number;
  violations: number;
  lastSeen: string | null;
  createdAt: string;
}

export interface AdminDevice {
  _id: string;
  userId: {
    _id: string;
    email: string;
    name: string;
  };
  deviceName: string;
  deviceType: string;
  platform: string;
  status: string;
  dnsStatus: string;
  lastHeartbeat: string;
  violations: number;
  createdAt: string;
}

export interface AdminSubscription {
  _id: string;
  userId: {
    _id: string;
    email: string;
    name: string;
  };
  tier: string;
  amount: number;
  status: string;
  nextBilling: string;
  paymentMethod: string;
  createdAt: string;
}

export interface AdminViolation {
  _id: string;
  userId: {
    _id: string;
    email: string;
    name: string;
  };
  deviceId: {
    _id: string;
    deviceName: string;
  };
  type: string;
  severity: string;
  timestamp: string;
  details: string;
  blocked: boolean;
  createdAt: string;
}

export interface AdminAnalytics {
  userGrowth: Array<{ _id: string; count: number }>;
  violationTrends: Array<{ _id: string; count: number }>;
  subscriptionDistribution: Array<{ _id: string; count: number }>;
  revenueData: Array<{ _id: string; revenue: number }>;
}

export interface AdminSettings {
  autoBlock: boolean;
  emailNotifications: boolean;
  systemMaintenance: boolean;
  debugMode: boolean;
  apiRateLimit: boolean;
  backupEnabled: boolean;
}

export interface SystemInfo {
  version: string;
  uptime: string;
  lastBackup: string;
  dbSize: string;
  apiCalls: string;
  errorRate: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001/ws';

class ApiService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private ws: WebSocket | null = null;

  constructor() {
    this.loadTokens();
  }

  private loadTokens() {
    this.token = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private saveTokens(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshAuthToken();
        if (refreshed) {
          // Retry the original request
          headers.Authorization = `Bearer ${this.token}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          return await this.handleResponse<T>(retryResponse);
        } else {
          this.clearTokens();
          window.location.href = '/login';
          return { success: false, error: 'Authentication failed' };
        }
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, error: 'Network error' };
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Request failed' };
      }
      
      return { success: true, data: data.data || data };
    }
    
    if (!response.ok) {
      return { success: false, error: 'Request failed' };
    }
    
    return { success: true };
  }

  private async refreshAuthToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.saveTokens(data.token, data.refresh_token);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // Authentication
  async register(email: string, name: string, password: string, subscriptionTier: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password, subscription_tier: subscriptionTier }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.saveTokens(response.data.token, response.data.refresh_token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request<void>('/auth/logout', {
      method: 'POST',
    });
    
    this.clearTokens();
    this.disconnectWebSocket();
    
    return response;
  }

  // Device Management
  async registerDevice(deviceToken: string, platform: string): Promise<ApiResponse<Device>> {
    return this.request<Device>('/devices', {
      method: 'POST',
      body: JSON.stringify({ device_token: deviceToken, platform }),
    });
  }

  async getDevices(): Promise<ApiResponse<Device[]>> {
    return this.request<Device[]>('/devices');
  }

  async sendHeartbeat(deviceId: string, dnsStatus: boolean): Promise<ApiResponse<void>> {
    return this.request<void>(`/devices/${deviceId}/heartbeat`, {
      method: 'POST',
      body: JSON.stringify({ dns_status: dnsStatus }),
    });
  }

  // Subscription Management
  async getSubscription(): Promise<ApiResponse<Subscription>> {
    return this.request<Subscription>('/subscriptions/current');
  }

  async updateSubscription(tier: string): Promise<ApiResponse<Subscription>> {
    return this.request<Subscription>('/subscriptions', {
      method: 'PUT',
      body: JSON.stringify({ tier }),
    });
  }

  // Spiritual Sponsor Management
  async getSponsors(): Promise<ApiResponse<SpiritualSponsor[]>> {
    return this.request<SpiritualSponsor[]>('/sponsors');
  }

  async createSponsor(sponsorData: Omit<SpiritualSponsor, 'id' | 'user_id' | 'created_at'>): Promise<ApiResponse<SpiritualSponsor>> {
    return this.request<SpiritualSponsor>('/sponsors', {
      method: 'POST',
      body: JSON.stringify(sponsorData),
    });
  }

  async updateSponsor(sponsorId: string, sponsorData: Partial<SpiritualSponsor>): Promise<ApiResponse<SpiritualSponsor>> {
    return this.request<SpiritualSponsor>(`/sponsors/${sponsorId}`, {
      method: 'PUT',
      body: JSON.stringify(sponsorData),
    });
  }

  async deleteSponsor(sponsorId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/sponsors/${sponsorId}`, {
      method: 'DELETE',
    });
  }

  // Violation Tracking
  async reportViolation(deviceId: string, type: string, details: string): Promise<ApiResponse<Violation>> {
    return this.request<Violation>('/violations', {
      method: 'POST',
      body: JSON.stringify({ device_id: deviceId, type, details }),
    });
  }

  async getViolations(): Promise<ApiResponse<Violation[]>> {
    return this.request<Violation[]>('/violations');
  }

  // Progress Reports
  async getProgressReports(): Promise<ApiResponse<ProgressReport[]>> {
    return this.request<ProgressReport[]>('/reports');
  }

  async createProgressReport(daysCompleted: number, violationCount: number): Promise<ApiResponse<ProgressReport>> {
    return this.request<ProgressReport>('/reports', {
      method: 'POST',
      body: JSON.stringify({ days_completed: daysCompleted, violation_count: violationCount }),
    });
  }

  // Admin API Methods
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return this.request<AdminStats>('/admin/stats');
  }

  async getAdminUsers(page: number = 1, limit: number = 10, search: string = ''): Promise<ApiResponse<{ users: AdminUser[]; total: number; page: number; pages: number }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    return this.request<{ users: AdminUser[]; total: number; page: number; pages: number }>(`/admin/users?${params}`);
  }

  async getAdminUserDetails(userId: string): Promise<ApiResponse<{ user: AdminUser; devices: AdminDevice[]; violations: AdminViolation[]; reports: ProgressReport[] }>> {
    return this.request<{ user: AdminUser; devices: AdminDevice[]; violations: AdminViolation[]; reports: ProgressReport[] }>(`/admin/users/${userId}`);
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<ApiResponse<AdminUser>> {
    return this.request<AdminUser>(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminDevices(page: number = 1, limit: number = 10, status?: string): Promise<ApiResponse<{ devices: AdminDevice[]; total: number; page: number; pages: number }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });
    return this.request<{ devices: AdminDevice[]; total: number; page: number; pages: number }>(`/admin/devices?${params}`);
  }

  async forceDeviceSync(deviceId: string): Promise<ApiResponse<AdminDevice>> {
    return this.request<AdminDevice>(`/admin/devices/${deviceId}/sync`, {
      method: 'POST',
    });
  }

  async disconnectDevice(deviceId: string): Promise<ApiResponse<AdminDevice>> {
    return this.request<AdminDevice>(`/admin/devices/${deviceId}/disconnect`, {
      method: 'POST',
    });
  }

  async getAdminSubscriptions(page: number = 1, limit: number = 10, status?: string): Promise<ApiResponse<{ subscriptions: AdminSubscription[]; total: number; page: number; pages: number; revenueStats: { totalRevenue: number; monthlyRecurring: number } }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });
    return this.request<{ subscriptions: AdminSubscription[]; total: number; page: number; pages: number; revenueStats: { totalRevenue: number; monthlyRecurring: number } }>(`/admin/subscriptions?${params}`);
  }

  async getAdminViolations(page: number = 1, limit: number = 10, severity?: string, timeFilter: string = 'today'): Promise<ApiResponse<{ violations: AdminViolation[]; total: number; page: number; pages: number; stats: { total: number; blocked: number; highSeverity: number } }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      timeFilter,
      ...(severity && { severity })
    });
    return this.request<{ violations: AdminViolation[]; total: number; page: number; pages: number; stats: { total: number; blocked: number; highSeverity: number } }>(`/admin/violations?${params}`);
  }

  async getAdminAnalytics(period: number = 30): Promise<ApiResponse<AdminAnalytics>> {
    return this.request<AdminAnalytics>(`/admin/analytics?period=${period}`);
  }

  async getAdminSettings(): Promise<ApiResponse<{ settings: AdminSettings; systemInfo: SystemInfo }>> {
    return this.request<{ settings: AdminSettings; systemInfo: SystemInfo }>('/admin/settings');
  }

  async updateAdminSettings(settings: Partial<AdminSettings>): Promise<ApiResponse<{ settings: AdminSettings }>> {
    return this.request<{ settings: AdminSettings }>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify({ settings }),
    });
  }

  // WebSocket Management
  connectWebSocket(onMessage: (data: any) => void, onError?: (error: Event) => void): void {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(`${WEBSOCKET_URL}?token=${this.token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError?.(error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (this.token) {
          this.connectWebSocket(onMessage, onError);
        }
      }, 5000);
    };
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService();
export default apiService; 