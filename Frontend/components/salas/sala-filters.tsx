"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

export interface FilterValues {
  search: string
  capacidadMin: number
  disponible: boolean
  equipamiento: string[]
}

interface SalaFiltersProps {
  onFilterChange: (filters: FilterValues) => void
}

const equipamientoOptions = [
  "Proyector",
  "Pizarra",
  "WiFi",
  "Aire Acondicionado",
  "TV",
  "Sistema de Audio",
  "Videoconferencia",
]

export function SalaFilters({ onFilterChange }: SalaFiltersProps) {
  const [search, setSearch] = useState("")
  const [capacidadMin, setCapacidadMin] = useState(1)
  const [disponible, setDisponible] = useState(false)
  const [equipamiento, setEquipamiento] = useState<string[]>([])

  const handleApplyFilters = () => {
    onFilterChange({
      search,
      capacidadMin,
      disponible,
      equipamiento,
    })
  }

  const handleClearFilters = () => {
    setSearch("")
    setCapacidadMin(1)
    setDisponible(false)
    setEquipamiento([])
    onFilterChange({
      search: "",
      capacidadMin: 1,
      disponible: false,
      equipamiento: [],
    })
  }

  const toggleEquipamiento = (item: string) => {
    setEquipamiento((prev) => (prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar por nombre o ubicación</Label>
          <Input
            id="search"
            placeholder="Ej: Sala A-101, Edificio B..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Capacidad mínima: {capacidadMin} personas</Label>
          <Slider
            value={[capacidadMin]}
            onValueChange={(value) => setCapacidadMin(value[0])}
            min={1}
            max={15}
            step={1}
            className="py-4"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="disponible"
            checked={disponible}
            onCheckedChange={(checked) => setDisponible(checked as boolean)}
          />
          <Label htmlFor="disponible" className="cursor-pointer">
            Solo mostrar salas disponibles
          </Label>
        </div>

        <div className="space-y-3">
          <Label>Equipamiento requerido</Label>
          <div className="space-y-2">
            {equipamientoOptions.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={equipamiento.includes(item)}
                  onCheckedChange={() => toggleEquipamiento(item)}
                />
                <Label htmlFor={item} className="cursor-pointer text-sm">
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleApplyFilters} className="flex-1">
            Aplicar Filtros
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
