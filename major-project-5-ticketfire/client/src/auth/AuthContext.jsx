import { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/api';

export const AuthContext = createContext(null); // eslint-disable-line

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial Load (refresh)
  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!stored || !token) {
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);

        // Admin Guard - admins have no client
        if (parsedUser.role === 'admin') {
          setClient(null);
          setLoading(false);
          return;
        }

        // Fetch fresh client data
        const freshClient = await apiFetch(`/${parsedUser.client.slug}`);
        setClient(freshClient);
      } catch (err) {
        console.error('Auth init error:', err);
        localStorage.clear();
      }

      setLoading(false);
    };

    init();
  }, []);

  // Login Flow (preload client)
  const login = async (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    setUser(data.user);

    // Admin Guard - admins have no client
    if (data.user.role === 'admin') {
      setClient(null);
      setLoading(false);
      return;
    }

    // Fetch client *before* navigation
    const freshClient = await apiFetch(`/${data.user.client.slug}`);
    setClient(freshClient);

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setClient(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        client,
        loading,
        login,
        logout,
        setClient,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
