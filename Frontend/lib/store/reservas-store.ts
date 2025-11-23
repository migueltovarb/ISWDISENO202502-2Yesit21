import { create } from "zustand"
import type { IReserva } from "../types"
import { reservaService } from "../services/reserva-service"

interface ReservasState {
  reservas: IReserva[]
  isLoading: boolean
  error: string | null
  fetchReservas: () => Promise<void>
  fetchReservasByUsuario: (usuarioId: string) => Promise<void>
  fetchReservasBySala: (salaId: string) => Promise<void>
  createReserva: (data: {
    salaId: string
    fechaInicio: string
    fechaFin: string
    motivo?: string
  }) => Promise<void>
  cancelReserva: (reservaId: string) => Promise<void>
  clearError: () => void
}

export const useReservasStore = create<ReservasState>((set) => ({
  reservas: [],
  isLoading: false,
  error: null,

  fetchReservas: async () => {
    set({ isLoading: true, error: null })
    try {
      const reservas = await reservaService.getReservas()
      set({ reservas, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  fetchReservasByUsuario: async (usuarioId: string) => {
    set({ isLoading: true, error: null })
    try {
      const reservas = await reservaService.getReservasByUsuario(usuarioId)
      set({ reservas, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  fetchReservasBySala: async (salaId: string) => {
    set({ isLoading: true, error: null })
    try {
      const reservas = await reservaService.getReservasBySala(salaId)
      set({ reservas, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  createReserva: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await reservaService.createReserva(data)
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  cancelReserva: async (reservaId: string) => {
    set({ isLoading: true, error: null })
    try {
      await reservaService.cancelReserva(reservaId)
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
