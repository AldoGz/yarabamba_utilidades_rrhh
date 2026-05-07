import axios from "axios";

// API configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejo de errores global (opcional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes centralizar logs, mostrar notificaciones, etc.
    const customError = {
      code: error.response?.status || 500,
      msg: error.response?.data?.message || "Error de red o servidor",
    };
    return Promise.reject(customError);
  },
);
