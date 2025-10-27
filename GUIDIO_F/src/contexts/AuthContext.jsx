// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const AUTH_TOKEN_KEY = "user";
  const TIME_REQUEST_TOKEN = import.meta.env.VITE_TIME_REQUEST_TOKEN;
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    // Cuando el token expira, el servicio puede devolver null
    const checkToken = () => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    };

    // Verifica cada cierto tiempo (ej: 30s)
    const interval = setInterval(checkToken, TIME_REQUEST_TOKEN);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    authService.logout();
    localStorage.removeItem(AUTH_TOKEN_KEY); // Elimina el usuario del almacenamiento local
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // si los children son elementos JSX (lo normal)
};
