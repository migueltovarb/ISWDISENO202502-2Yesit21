"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardTemplate } from "@/components/templates/dashboard-template"
import { SalaCard } from "@/components/salas/sala-card"
import { SalaFilters, type FilterValues } from "@/components/salas/sala-filters"
import { salaService } from "@/lib/services/sala-service"
import type { ISala } from "@/lib/types"
import { Button } from "@/components/ui/button"

export default function SalasPage() {
  const router = useRouter()
  const [salas, setSalas] = useState<ISala[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    capacidadMin: 1,
    disponible: false,
    equipamiento: [],
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("current_user")
    if (!storedUser) {
      window.location.href = "/login"
      return
    }
    loadSalas()
  }, [])

  const loadSalas = async () => {
    try {
      const data = await salaService.getSalas()
      setSalas(data)
    } catch (error) {
      console.error("Error loading salas:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSalas = salas.filter((sala) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        sala.nombre.toLowerCase().includes(searchLower) || sala.ubicacion.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    if (sala.capacidad < filters.capacidadMin) return false

    if (filters.disponible && !sala.disponible) return false

    if (filters.equipamiento.length > 0) {
      const hasAllEquipment = filters.equipamiento.every((equip) => sala.equipamiento.includes(equip))
      if (!hasAllEquipment) return false
    }

    return true
  })

  if (loading) {
    return (
      <DashboardTemplate>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardTemplate>
    )
  }

  return (
    <DashboardTemplate>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
          ← Volver al Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">Buscar Salas de Estudio</h1>
        <p className="text-muted-foreground">Encuentra la sala perfecta para tus necesidades</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SalaFilters onFilterChange={setFilters} />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredSalas.length} de {salas.length} salas
            </p>
          </div>

          {filteredSalas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron salas con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredSalas.map((sala) => (
                <SalaCard
                  key={sala.id}
                  sala={sala}
                  onViewDetails={(id) => router.push(`/salas/${id}`)}
                  onReserve={(id) => router.push(`/salas/${id}?action=reserve`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardTemplate>
  )
}
