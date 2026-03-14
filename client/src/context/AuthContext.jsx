import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
  );
  const [loading, setLoading] = useState(!!token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const bootstrap = async () => {
      try {
        const data = await authService.getMe();
        if (!cancelled) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    bootstrap();

    const handleUnauthorized = () => {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      navigate('/login', { replace: true });
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      cancelled = true;
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [token, navigate]);

  const handleLogin = useCallback(async ({ email, password }) => {
    const data = await authService.login({ email, password });

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setUser(data.user);

      if (data.user?.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate('/dashboard/user', { replace: true });
      }
    }

    return data;
  }, [navigate]);

  const handleGoogleLogin = useCallback(async (credential) => {
    const data = await authService.googleLogin(credential);

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setUser(data.user);

      if (data.user?.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate('/dashboard/user', { replace: true });
      }
    }

    return data;
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore API errors on logout
    }
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    navigate('/', { replace: true });
  }, [navigate]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    role: user?.role ?? 'user',
    login: handleLogin,
    googleLogin: handleGoogleLogin,
    logout: handleLogout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

