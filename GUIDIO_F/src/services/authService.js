// src/services${SECCION_URL}Service.js
import { jwtDecode } from "jwt-decode";
import api from "./api"; // Importa la instancia de Axios configurada

const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;
const SECCION_URL = '/auth';

const register = async (username, email, password) => {
  try {
    const response = await api.post(`${SECCION_URL}/register`, {
      username,
      email,
      password,
    });
    // Si el registro es exitoso y el backend devuelve el usuario y un token, guárdalo
    if (response.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

const login = async (email, password) => {
  try {
    const response = await api.post(`${SECCION_URL}/login`, { email, password });
       
    if (response.data.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(response.data.data.token));
    }
    
    
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY); // Elimina el usuario del almacenamiento local
};

const getCurrentUser = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return null; // No hay usuario en localStorage
  }

  try {
    
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos

    // Comprueba si el token ha expirado
    if (decodedToken.exp < currentTime) {
      console.log("Token ha caducado. Cerrando sesión automáticamente.");
      logout(); // Cierra la sesión si el token ha caducado
      return null;
    }
    
    return decodedToken; // El token es válido y no ha caducado
  } catch (error) {
    console.error("Error decodificando o parseando el token JWT:", error);
    logout(); // Si hay un error al decodificar, el token es inválido, cierra sesión
    return null;
  }
};

/**
 * Guarda la información del usuario actual en localStorage.
 * Es importante que esta información no incluya datos sensibles como la contraseña.
 * @param {Object} userData - Un objeto con los datos del usuario (ej. id, username, email, profilePicture, bio, etc.).
 */
const setCurrentUser = (userData) => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error al guardar el usuario en localStorage:", error);
  }
};

/**
 * Actualiza solo ciertos campos del usuario actual en localStorage.
 * Mantiene los campos existentes que no se pasan en `updatedData`.
 * Esto es útil después de una edición de perfil donde solo cambian username, email, bio, etc.
 * @param {Object} updatedData - Un objeto con los campos del usuario que se quieren actualizar.
 */
const updateCurrentUser = (updatedData) => {
  try {
    let currentUser = authService.getCurrentUser(); // Obtiene el usuario actual
    if (currentUser) {
      // Combina los datos existentes con los datos actualizados
      const newUser = { ...currentUser, ...updatedData };
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(newUser));
    } else {
      // Si no hay un usuario previo, establece el nuevo como actual
      authService.setCurrentUser(updatedData);
    }
  } catch (error) {
    console.error("Error al actualizar el usuario en localStorage:", error);
  }
};

// Obtener un evento por su ID (este ya estaba bien)
const getProfile = async () => {
  try {
    const response = await api.get(`${SECCION_URL}/profile`);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching profile`);
    throw error;
  }
};

/**
 * Comprueba el estado del backend.
 * @returns {Promise<{ok: boolean, message?: string}>} 
 *   ok: true si el backend responde correctamente
 *   message: descripción del error si no responde
 */
const checkBackend = async () => {
  try {
    const response = await api.get(`${SECCION_URL}/health`);

    // Suponiendo que la API devuelve { status: "ok" } cuando está operativo
    if (response.data?.data?.status === "OK") {
      return { ok: true };
    } else {
      return { ok: false, message: "Backend not healthy" };
    }
  } catch (error) {
    return { ok: false, message: error.message || "Backend unreachable" };
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  setCurrentUser,
  updateCurrentUser,
  getProfile,
  checkBackend,
};

export default authService;
