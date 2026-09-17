import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load persisted user session on app load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('erp_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      localStorage.removeItem('erp_user');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login Handler
   * @param {string} username 
   * @param {string} password 
   */
  const login = async (username, password) => {
    try {
      const response = await authService.login({ username, password });
      if (response?.success && response.user) {
        const rawRole = (response.user.role || 'STUDENT').toUpperCase();
        const normalizedRole = rawRole === 'SYSTEM_ADMIN' ? 'ADMIN' : rawRole;
        const userData = {
          ...response.user,
          role: normalizedRole
        };
        localStorage.setItem('erp_user', JSON.stringify(userData));
        setUser(userData);
        return { ...response, user: userData };
      }

      return response;
    } catch (error) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Invalid credentials or server error.');
      return { success: false, message: errMsg };
    }
  };

  /**
   * Register Handler
   * @param {Object} formData 
   */
  const register = async (formData) => {
    try {
      const response = await authService.register(formData);
      return response;
    } catch (error) {
      const errMsg = typeof error === 'string' ? error : (error?.message || 'Registration failed. Please try again.');
      return { success: false, message: errMsg };
    }
  };

  /**
   * Logout Handler
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook to consume Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;