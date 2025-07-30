import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi';

interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => boolean;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [sessionTimeout, setSessionTimeout] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Define logout function first
  const logout = useCallback(() => {
    setUser(null);
    setSessionTimeout(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionTimeout');
    localStorage.removeItem('access_token');
  }, []);

  const checkAuthStatus = useCallback((): boolean => {
    if (!user || !sessionTimeout) return false;
    
    if (Date.now() >= sessionTimeout) {
      logout();
      return false;
    }
    
    return true;
  }, [user, sessionTimeout, logout]);

  // Check for existing login on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedTimeout = localStorage.getItem('sessionTimeout');
    
    if (savedUser && savedTimeout) {
      const timeoutTimestamp = parseInt(savedTimeout);
      if (Date.now() < timeoutTimestamp) {
        setUser(savedUser);
        setSessionTimeout(timeoutTimestamp);
        setIsAuthenticated(true);

        const remainingTime = timeoutTimestamp - Date.now();
        setTimeout(() => {
          logout();
          alert('Your session has expired. Please log in again.');
        }, remainingTime);
      } else {
        logout();
      }
    }
    setIsLoading(false);
  }, [logout]);

  const login = async (username: string, password: string) => {
    try {
      // Try to use the authApi to login
      const response = await authApi.login({ username, password });
      const sessionExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes from now
      
      setUser(username);
      setSessionTimeout(sessionExpiry);
      setIsAuthenticated(true);
      localStorage.setItem('user', username);
      localStorage.setItem('sessionTimeout', sessionExpiry.toString());
      localStorage.setItem('access_token', response.access_token);
      
      // Set up automatic logout
      setTimeout(() => {
        logout();
        alert('Your session has expired. Please log in again.');
      }, 30 * 60 * 1000); // 30 minutes
    } catch (error) {
      console.error('API login failed, trying fallback:', error);
      
      // Fallback to simple credential check if API fails
      if (username === 'admin' && password === 'admin') {
        const sessionExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes from now
        
        setUser(username);
        setSessionTimeout(sessionExpiry);
        setIsAuthenticated(true);
        localStorage.setItem('user', username);
        localStorage.setItem('sessionTimeout', sessionExpiry.toString());
        
        // Set up automatic logout
        setTimeout(() => {
          logout();
          alert('Your session has expired. Please log in again.');
        }, 30 * 60 * 1000); // 30 minutes
      } else {
        throw new Error('Invalid credentials');
      }
    }
  };

  // Update authentication status whenever user or sessionTimeout changes
  useEffect(() => {
    const authStatus = checkAuthStatus();
    setIsAuthenticated(authStatus);
  }, [user, sessionTimeout, checkAuthStatus]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
