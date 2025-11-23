import { apiClient } from "../api/axios-config"
import type { Notificacion } from "../types"

export const notificacionService = {
  async getNotificacionesPorUsuario(usuarioId: string): Promise<Notificacion[]> {
    try {
      const response = await apiClient.get<Notificacion[]>(`/notificaciones/usuario/${usuarioId}`)
      return response.data
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error)
      return []
    }
  },

  async getNotificacionesPorReserva(reservaId: string): Promise<Notificacion[]> {
    try {
      const response = await apiClient.get<Notificacion[]>(`/notificaciones/reserva/${reservaId}`)
      return response.data
    } catch (error) {
      console.error("Error obteniendo notificaciones de reserva:", error)
      return []
    }
  },

  async getNotificacionesPendientes(): Promise<Notificacion[]> {
    try {
      const response = await apiClient.get<Notificacion[]>("/notificaciones/pendientes")
      return response.data
    } catch (error) {
      console.error("Error obteniendo notificaciones pendientes:", error)
      return []
    }
  },
}
