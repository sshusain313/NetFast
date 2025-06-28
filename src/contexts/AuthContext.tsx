import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import apiService, { User, AuthResponse } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, subscriptionTier: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (apiService.isAuthenticated()) {
        // Try to get user info from a protected endpoint
        const response = await apiService.getSubscription();
        if (response.success && response.data) {
          // If we can access protected data, user is authenticated
          // We'll get user info from the subscription response or make a separate call
          await refreshUser();
        } else {
          // Token is invalid, clear auth state
          await logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      // Get user info from subscription endpoint
      const response = await apiService.getSubscription();
      if (response.success && response.data) {
        // Extract user info from subscription or make a separate user endpoint call
        // For now, we'll create a minimal user object from available data
        const userInfo: User = {
          id: 'temp-id', // This should come from a proper user endpoint
          name: 'User', // This should come from a proper user endpoint
          email: 'user@example.com', // This should come from a proper user endpoint
          subscription_tier: response.data.tier,
          isAdmin: false, // This should come from a proper user endpoint
          created_at: response.data.created_at,
        };
        setUser(userInfo);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Welcome back to your digital sanctuary');
        navigate('/');
        return true;
      } else {
        toast.error(response.error || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, subscriptionTier: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiService.register(email, name, password, subscriptionTier);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Welcome to your digital discipline journey');
        navigate('/');
        return true;
      } else {
        toast.error(response.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 