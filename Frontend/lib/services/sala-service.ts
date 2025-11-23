import { apiClient } from "../api/axios-config"
import type { ISala } from "../types"

export const salaService = {
  async getSalas(filters?: {
    capacidad?: number
    ubicacion?: string
    disponible?: boolean
  }): Promise<ISala[]> {
    try {
      let url = "/salas"
      
      if (filters?.disponible) {
        url = "/salas/disponibles"
      } else if (filters?.capacidad || filters?.ubicacion) {
        url = "/salas/buscar"
      }

      const response = await apiClient.get<ISala[]>(url, {
        params: {
          capacidad: filters?.capacidad,
          ubicacion: filters?.ubicacion,
        },
      })

      return response.data
    } catch (error: any) {
      console.error("Error obteniendo salas:", error)
      throw new Error(error.response?.data || "Error al obtener salas")
    }
  },

  async getSalaById(id: string): Promise<ISala> {
    try {
      const response = await apiClient.get<ISala>(`/salas/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data || "Sala no encontrada")
    }
  },

  async createSala(data: Omit<ISala, "id">): Promise<ISala> {
    try {
      const response = await apiClient.post<ISala>("/salas", data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data || "Error al crear sala")
    }
  },

  async updateSala(id: string, data: Partial<ISala>): Promise<ISala> {
    try {
      const response = await apiClient.put<ISala>(`/salas/${id}`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data || "Error al actualizar sala")
    }
  },

  async deleteSala(id: string): Promise<void> {
    try {
      await apiClient.delete(`/salas/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data || "Error al eliminar sala")
    }
  },
}
