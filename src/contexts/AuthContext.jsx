import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshTimerRef = useRef(null);

  // Auto-refresh access token before it expires (refresh every 50 minutes)
  const startRefreshTimer = () => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Refresh every 50 minutes (access token expires in 1 hour)
    refreshTimerRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Send cookies
        });

        const data = await response.json();

        if (!data.success) {
          // Refresh failed, log user out
          console.error('Auto-refresh failed:', data.error);
          await logout();
        } else {
          console.log('Access token auto-refreshed');
        }
      } catch (err) {
        console.error('Auto-refresh error:', err);
      }
    }, 50 * 60 * 1000); // 50 minutes
  };

  // Stop refresh timer
  const stopRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  // Verify current session on mount
  useEffect(() => {
    verifySession();

    // Cleanup timer on unmount
    return () => {
      stopRefreshTimer();
    };
  }, []);

  // Verify session with backend
  const verifySession = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        credentials: 'include', // Send cookies
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        startRefreshTimer(); // Start auto-refresh
      } else {
        // No valid session
        setUser(null);
        stopRefreshTimer();
      }
    } catch (err) {
      console.error('Session verification error:', err);
      setUser(null);
      stopRefreshTimer();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send/receive cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        startRefreshTimer(); // Start auto-refresh
        return { success: true };
      } else {
        setError(data.error || 'Login failed');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Register function
  const register = async (email, password, fullName, block, unit, phoneNumber) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send/receive cookies
        body: JSON.stringify({
          email,
          password,
          fullName,
          block,
          unit,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        startRefreshTimer(); // Start auto-refresh
        return { success: true };
      } else {
        setError(data.error || 'Registration failed');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint to clear cookies
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      stopRefreshTimer();
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    verifySession, // Expose for manual refresh if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
