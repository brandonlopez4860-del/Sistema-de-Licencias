import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Interceptor para enviar token en todas las peticiones
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    
    // Verificar si hay usuario guardado
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Función de login conectada al backend
  const login = async (dni, password) => {
    try {
      const response = await axios.post('http://localhost:3006/api/auth/login', {
        dni,
        password
      });

      // Si la respuesta es exitosa, guardamos el token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setIsAuthenticated(true);
        setUser(response.data.usuario);
        return { success: true };
      }
      return { success: false, message: 'Respuesta inesperada del servidor' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.mensaje || 'Error al conectar con el servidor',
        errorType: error.response?.data?.errorType || 'AUTH_ERROR'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);