import { apiClient } from "../api/axios-config"
import type { AuthResponse, IUsuario } from "../types"

const AUTH_TOKEN_KEY = "auth_token"
const CURRENT_USER_KEY = "current_user"

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log("Enviando petición de login a:", "/auth/login")
      const response = await apiClient.post<AuthResponse>("/auth/login", {
        email,
        password,
      })

      console.log("Respuesta del servidor:", response.data)

      const { token, usuario } = response.data

      if (!token || !usuario) {
        throw new Error("Respuesta inválida del servidor")
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(usuario))
        console.log("Token y usuario guardados en localStorage")
      }

      return response.data
    } catch (error: any) {
      console.error("Error en authService.login:", error)
      
      if (error.response) {
        // El servidor respondió con un código de error
        const status = error.response.status
        const data = error.response.data
        
        if (status === 401) {
          throw new Error("Credenciales inválidas. Verifica tu email y contraseña.")
        } else if (status === 404) {
          throw new Error("Usuario no encontrado. ¿Necesitas registrarte?")
        } else if (typeof data === 'string') {
          throw new Error(data)
        } else {
          throw new Error("Error al iniciar sesión. Intenta de nuevo.")
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.")
      } else {
        // Algo pasó al configurar la petición
        throw new Error(error.message || "Error al iniciar sesión")
      }
    }
  },

  async register(data: {
    nombre: string
    apellido?: string
    email: string
    password: string
    telefono?: string
    carrera?: string
    rol?: "estudiante" | "administrador"
  }): Promise<AuthResponse> {
    try {
      const payload = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        telefono: data.telefono || "",
        carrera: data.carrera || "",
        rol: data.rol?.toUpperCase() || "ESTUDIANTE",
      }
      
      console.log("Enviando petición de registro:", payload)
      const response = await apiClient.post<AuthResponse>("/auth/register", payload)
      console.log("Respuesta del servidor:", response.data)

      const { token, usuario } = response.data

      if (!token || !usuario) {
        throw new Error("Respuesta inválida del servidor")
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(usuario))
        console.log("Token y usuario guardados en localStorage")
      }

      return response.data
    } catch (error: any) {
      console.error("Error en authService.register:", error)
      
      if (error.response) {
        const status = error.response.status
        const data = error.response.data
        
        if (status === 400) {
          if (typeof data === 'string' && data.includes("ya está registrado")) {
            throw new Error("El email ya está registrado. Intenta iniciar sesión.")
          }
          throw new Error(typeof data === 'string' ? data : "Datos inválidos. Verifica el formulario.")
        } else if (typeof data === 'string') {
          throw new Error(data)
        } else {
          throw new Error("Error al registrar usuario. Intenta de nuevo.")
        }
      } else if (error.request) {
        throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.")
      } else {
        throw new Error(error.message || "Error al registrar usuario")
      }
    }
  },

  getCurrentUser(): IUsuario | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem(CURRENT_USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  },

  logout() {
    if (typeof window === "undefined") return
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(CURRENT_USER_KEY)
  },
}
