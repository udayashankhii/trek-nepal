// src/api/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getAccessToken, 
  getCurrentUser, 
  clearAuthTokens, 
  logout as apiLogout // ✅ Import logout directly
} from './auth.api.js'; // ✅ Same folder, so just ./

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  const checkAuth = useCallback(() => {
    try {
      const token = getAccessToken();
      const currentUser = getCurrentUser();
      
      const isAuth = Boolean(token);
      setIsAuthenticated(isAuth);
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for storage changes (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only react to auth-related storage changes
      if (e.key === 'accessToken' || e.key === 'user' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  // Login handler - updates state after successful login
  const login = useCallback((userData) => {
    const currentUser = userData || getCurrentUser();
    setIsAuthenticated(true);
    setUser(currentUser);
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      // ✅ Use imported function directly - no dynamic import needed
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear state regardless of API result
      clearAuthTokens();
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Refresh auth state manually if needed
  const refreshAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
