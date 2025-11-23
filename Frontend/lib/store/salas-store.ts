import { create } from "zustand"
import type { ISala } from "../types"
import { salaService } from "../services/sala-service"

interface SalasState {
  salas: ISala[]
  selectedSala: ISala | null
  isLoading: boolean
  error: string | null
  fetchSalas: (filters?: {
    capacidad?: number
    disponible?: boolean
    equipamiento?: string[]
  }) => Promise<void>
  fetchSalaById: (id: string) => Promise<void>
  createSala: (data: Omit<ISala, "id">) => Promise<void>
  updateSala: (id: string, data: Partial<ISala>) => Promise<void>
  deleteSala: (id: string) => Promise<void>
  clearError: () => void
}

export const useSalasStore = create<SalasState>((set) => ({
  salas: [],
  selectedSala: null,
  isLoading: false,
  error: null,

  fetchSalas: async (filters) => {
    set({ isLoading: true, error: null })
    try {
      const salas = await salaService.getSalas(filters)
      set({ salas, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  fetchSalaById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const sala = await salaService.getSalaById(id)
      set({ selectedSala: sala, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  createSala: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await salaService.createSala(data)
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  updateSala: async (id: string, data: Partial<ISala>) => {
    set({ isLoading: true, error: null })
    try {
      await salaService.updateSala(id, data)
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  deleteSala: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await salaService.deleteSala(id)
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
