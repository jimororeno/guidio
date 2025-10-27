import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/';
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adjuntar el token JWT a cada petición si existe
api.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY));
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;