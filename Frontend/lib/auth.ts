// Authentication utilities and types
export interface User {
  id: string
  email: string
  nombre: string
  rol: "estudiante" | "administrador"
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  nombre: string
}

// Mock authentication - Replace with real API calls
export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  // Mock response
  return {
    user: {
      id: "1",
      email: credentials.email,
      nombre: "Usuario Demo",
      rol: credentials.email.includes("admin") ? "administrador" : "estudiante",
    },
    token: "mock-jwt-token-" + Date.now(),
  }
}

export async function register(data: RegisterData): Promise<{ user: User; token: string }> {
  return {
    user: {
      id: "2",
      email: data.email,
      nombre: data.nombre,
      rol: "estudiante",
    },
    token: "mock-jwt-token-" + Date.now(),
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("auth_user")
  return userStr ? JSON.parse(userStr) : null
}

export function storeAuth(token: string, user: User): void {
  localStorage.setItem("auth_token", token)
  localStorage.setItem("auth_user", JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("auth_user")
}
