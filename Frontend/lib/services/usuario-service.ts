import { apiClient } from "../api/axios-config"
import type { IUsuario } from "../types"

export const usuarioService = {
  async getUsuarios(): Promise<IUsuario[]> {
    try {
      const response = await apiClient.get<IUsuario[]>("/usuarios")
      return response.data
    } catch (error: any) {
      console.error("Error obteniendo usuarios:", error)
      throw new Error(error.response?.data || "Error al obtener usuarios")
    }
  },
}
