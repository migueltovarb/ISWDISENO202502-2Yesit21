import { apiClient } from "../api/axios-config"

export interface StatsResponse {
  total: number
  disponibles?: number
  pendientes?: number
  tasaOcupacion?: number
}

export const statsService = {
  async getTotalUsuarios(): Promise<number> {
    try {
      const response = await apiClient.get<{ total: number }>("/admin/stats/usuarios")
      return response.data.total
    } catch (error) {
      console.error("Error obteniendo total de usuarios:", error)
      return 0
    }
  },

  async getSalasStats(): Promise<{ total: number; disponibles: number }> {
    try {
      const response = await apiClient.get<{ total: number; disponibles: number }>("/admin/stats/salas")
      return response.data
    } catch (error) {
      console.error("Error obteniendo estadísticas de salas:", error)
      return { total: 0, disponibles: 0 }
    }
  },

  async getReservasHoy(): Promise<{ total: number; pendientes: number }> {
    try {
      const response = await apiClient.get<{ total: number; pendientes: number }>("/admin/stats/reservas-hoy")
      return response.data
    } catch (error) {
      console.error("Error obteniendo reservas de hoy:", error)
      return { total: 0, pendientes: 0 }
    }
  },

  async getReservasPendientes(): Promise<{ total: number; proximas: number }> {
    try {
      const response = await apiClient.get<{ total: number; proximas: number }>("/admin/stats/reservas-pendientes")
      return response.data
    } catch (error) {
      console.error("Error obteniendo reservas pendientes:", error)
      return { total: 0, proximas: 0 }
    }
  },

  async getTasaOcupacion(): Promise<number> {
    try {
      const response = await apiClient.get<{ tasaOcupacion: number }>("/admin/stats/tasa-ocupacion")
      return response.data.tasaOcupacion
    } catch (error) {
      console.error("Error obteniendo tasa de ocupación:", error)
      return 0
    }
  },
}
