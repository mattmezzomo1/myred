import { useState, useEffect } from 'react';
import mockAPI from '../services/mockAPI';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await mockAPI.auth.login(email, password);
      
      if (response.success) {
        setCurrentUser(response.user);
        setToken(response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await mockAPI.auth.register(userData);
      
      if (response.success) {
        setCurrentUser(response.user);
        setToken(response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Erro ao registrar' };
    }
  };

  const logout = async () => {
    try {
      await mockAPI.auth.logout();
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao fazer logout' };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await mockAPI.user.updateProfile(currentUser.id, updates);
      
      if (response.success) {
        setCurrentUser(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar perfil' };
    }
  };

  return {
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser && !!token
  };
}

