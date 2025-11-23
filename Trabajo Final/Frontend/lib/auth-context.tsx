"use client"

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react"
import type { IUsuario } from "./types"
import { authService } from "./services/auth-service"

interface AuthContextType {
  usuario: IUsuario | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  nombre: string
  apellido: string
  email: string
  password: string
  telefono?: string
  carrera?: string
  rol?: "estudiante" | "administrador"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<IUsuario | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("current_user")
      return storedUser ? JSON.parse(storedUser) : null
    }
    return null
  })

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  })

  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setToken(response.token)
    setUsuario(response.usuario)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    const response = await authService.register(data)
    setToken(response.token)
    setUsuario(response.usuario)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setToken(null)
    setUsuario(null)
  }, [])

  const value = useMemo(
    () => ({
      usuario,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      register,
      logout,
    }),
    [usuario, token, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
