import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => boolean;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [sessionTimeout, setSessionTimeout] = useState<number | null>(null);

  // Check for existing login on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedTimeout = localStorage.getItem('sessionTimeout');
    
    if (savedUser && savedTimeout) {
      const timeoutTimestamp = parseInt(savedTimeout);
      if (Date.now() < timeoutTimestamp) {
        setUser(savedUser);
        setSessionTimeout(timeoutTimestamp);
        
        // Set up automatic logout when session expires
        const remainingTime = timeoutTimestamp - Date.now();
        setTimeout(() => {
          logout();
          alert('Your session has expired. Please log in again.');
        }, remainingTime);
      } else {
        // Session expired, clean up
        logout();
      }
    }
  }, []);

  const checkAuthStatus = (): boolean => {
    if (!user || !sessionTimeout) return false;
    
    if (Date.now() >= sessionTimeout) {
      logout();
      return false;
    }
    
    return true;
  };

  const login = async (username: string, password: string) => {
    // Mock login logic with session timeout
    if (username === 'admin' && password === 'password') {
      const sessionExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes from now
      
      setUser(username);
      setSessionTimeout(sessionExpiry);
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
  };

  const logout = () => {
    setUser(null);
    setSessionTimeout(null);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionTimeout');
  };

  const isAuthenticated = checkAuthStatus();

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuthStatus }}>
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
