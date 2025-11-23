import { apiClient } from "../api/axios-config"
import type { IReserva } from "../types"

export const reservaService = {
  async createReserva(data: {
    salaId: string
    fechaInicio: string
    fechaFin: string
    motivo?: string
  }): Promise<IReserva> {
    const response = await apiClient.post<IReserva>("/reservas", {
      sala: { id: data.salaId },
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
    })
    return response.data
  },

  async getReservas(): Promise<IReserva[]> {
    try {
      const response = await apiClient.get<IReserva[]>("/reservas")
      return response.data
    } catch (error: any) {
      console.error("Error obteniendo reservas:", error)
      return []
    }
  },

  async getReservasByUsuario(usuarioId: string): Promise<IReserva[]> {
    try {
      const response = await apiClient.get<IReserva[]>(`/reservas/usuario/${usuarioId}`)
      return response.data
    } catch (error: any) {
      console.error("Error obteniendo reservas del usuario:", error)
      return []
    }
  },

  async getReservasBySala(salaId: string): Promise<IReserva[]> {
    try {
      const response = await apiClient.get<IReserva[]>(`/reservas/sala/${salaId}`)
      return response.data
    } catch (error: any) {
      console.error("Error obteniendo reservas de la sala:", error)
      return []
    }
  },

  async cancelReserva(reservaId: string, motivo: string): Promise<void> {
    await apiClient.delete(`/reservas/${reservaId}`, {
      params: { motivo },
    })
  },
}
