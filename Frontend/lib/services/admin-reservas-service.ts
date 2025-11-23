import { apiClient } from "../api/axios-config"
import type { IReserva } from "../types"

export const adminReservasService = {
  async desbloquearReserva(reservaId: string): Promise<IReserva> {
    try {
      const response = await apiClient.post<{ reserva: IReserva }>(
        `/admin/reservas/${reservaId}/desbloquear`
      )
      return response.data.reserva
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error al desbloquear reserva")
    }
  },

  async bloquearReserva(reservaId: string, motivo: string): Promise<IReserva> {
    try {
      const response = await apiClient.post<{ reserva: IReserva }>(
        `/admin/reservas/${reservaId}/bloquear`,
        { motivo }
      )
      return response.data.reserva
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error al bloquear reserva")
    }
  },

  async cambiarEstadoReserva(
    reservaId: string,
    nuevoEstado: "ACTIVA" | "CANCELADA" | "COMPLETADA",
    motivo?: string
  ): Promise<IReserva> {
    try {
      const response = await apiClient.put<{ reserva: IReserva }>(
        `/admin/reservas/${reservaId}/estado`,
        { nuevoEstado, motivo }
      )
      return response.data.reserva
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error al cambiar estado de reserva")
    }
  },

  async ejecutarRecordatorios24h(): Promise<void> {
    try {
      await apiClient.post("/admin/tareas/ejecutar/recordatorios-24h")
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error al ejecutar recordatorios")
    }
  },

  async ejecutarRecordatorios1h(): Promise<void> {
    try {
      await apiClient.post("/admin/tareas/ejecutar/recordatorios-1h")
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error al ejecutar recordatorios")
    }
  },

  async ejecutarBloqueoReservas(): Promise<void> {
    try {
      await apiClient.post("/admin/tareas/ejecutar/bloquear-reservas")
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error al ejecutar bloqueo")
    }
  },

  async obtenerEstadisticas(): Promise<any> {
    try {
      const response = await apiClient.get("/admin/tareas/estadisticas")
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error al obtener estadísticas")
    }
  },
}
