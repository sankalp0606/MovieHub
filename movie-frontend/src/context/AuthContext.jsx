import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api/authApi';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'movie_app_token';
const USER_KEY = 'movie_app_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const signIn = async (credentials) => {
    setLoading(true);

    try {
      const response = await login(credentials);
      const authPayload = response.data;
      const nextToken = authPayload.token;
      const nextUser = authPayload.user;

      if (!nextToken || !nextUser) {
        throw new Error('Invalid login response from backend.');
      }

      setToken(nextToken);
      setUser(nextUser);
      return { error: null, data: authPayload };
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Login failed.';
      return { error: { message }, data: null };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (payload) => {
    setLoading(true);

    try {
      const response = await signup(payload);
      return { error: null, data: response.data };
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Signup failed.';
      return { error: { message }, data: null };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login: signIn,
      signup: signUp,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
