import axios from "axios"

const API_BASE_URL = typeof window === "undefined" 
  ? "http://localhost:8080/api"
  : "/api"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Aumentado a 15 segundos
  headers: {
    "Content-Type": "application/json",
  },
  // Optimizaciones de rendimiento
  maxRedirects: 5,
  validateStatus: (status) => status < 500,
})

// Request interceptor - inject JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("current_user")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)
