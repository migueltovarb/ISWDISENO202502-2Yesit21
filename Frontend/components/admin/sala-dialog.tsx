"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { ISala } from "@/lib/types"

interface SalaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (sala: Partial<ISala>) => Promise<void>
  sala?: ISala | null
  mode: "create" | "edit"
}

const equipamientoOptions = [
  "Proyector",
  "Pizarra",
  "Computadoras",
  "WiFi",
  "Aire Acondicionado",
  "Sillas Ergonómicas",
  "Enchufes",
  "Micrófono",
]

export function SalaDialog({ open, onOpenChange, onSave, sala, mode }: SalaDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    capacidad: 10,
    ubicacion: "",
    equipamiento: [] as string[],
    imagen: "",
    disponible: true,
  })
  const [loading, setLoading] = useState(false)
  const [newEquipamiento, setNewEquipamiento] = useState("")

  useEffect(() => {
    if (sala && mode === "edit") {
      setFormData({
        nombre: sala.nombre,
        descripcion: sala.descripcion || "",
        capacidad: sala.capacidad,
        ubicacion: sala.ubicacion,
        equipamiento: sala.equipamiento || [],
        imagen: sala.imagen || "",
        disponible: sala.disponible,
      })
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        capacidad: 10,
        ubicacion: "",
        equipamiento: [],
        imagen: "",
        disponible: true,
      })
    }
  }, [sala, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSave(formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error guardando sala:", error)
    } finally {
      setLoading(false)
    }
  }

  const addEquipamiento = (equip: string) => {
    if (!formData.equipamiento.includes(equip)) {
      setFormData({ ...formData, equipamiento: [...formData.equipamiento, equip] })
    }
  }

  const removeEquipamiento = (equip: string) => {
    setFormData({
      ...formData,
      equipamiento: formData.equipamiento.filter((e) => e !== equip),
    })
  }

  const addCustomEquipamiento = () => {
    if (newEquipamiento.trim() && !formData.equipamiento.includes(newEquipamiento.trim())) {
      setFormData({
        ...formData,
        equipamiento: [...formData.equipamiento, newEquipamiento.trim()],
      })
      setNewEquipamiento("")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es muy grande. Por favor selecciona una imagen menor a 5MB")
      return
    }

    // Convertir a Base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData({ ...formData, imagen: base64String })
    }
    reader.onerror = () => {
      alert("Error al cargar la imagen. Por favor intenta de nuevo.")
    }
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nueva Sala" : "Editar Sala"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa la información para crear una nueva sala de estudio"
              : "Modifica la información de la sala"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Sala *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Sala A1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                placeholder="Ej: Edificio A, Piso 2"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Descripción de la sala..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacidad">Capacidad (personas) *</Label>
            <Input
              id="capacidad"
              type="number"
              min="1"
              max="100"
              value={formData.capacidad}
              onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) || 1 })}
              required
              className="max-w-xs"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagen de la Sala</Label>
            <div className="space-y-3">
              {/* Vista previa de la imagen */}
              {formData.imagen && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <img src={formData.imagen} alt="Vista previa" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, imagen: "" })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Botón para subir imagen */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="imagen-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("imagen-file")?.click()}
                  >
                    📁 Subir desde dispositivo
                  </Button>
                </div>
                <div className="flex-1">
                  <Input
                    id="imagen-url"
                    value={formData.imagen.startsWith("data:") ? "" : formData.imagen}
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    placeholder="O pega una URL..."
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Sube una imagen desde tu dispositivo o pega una URL de imagen
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Equipamiento</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {equipamientoOptions.map((equip) => (
                <Badge
                  key={equip}
                  variant={formData.equipamiento.includes(equip) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    formData.equipamiento.includes(equip) ? removeEquipamiento(equip) : addEquipamiento(equip)
                  }
                >
                  {equip}
                  {formData.equipamiento.includes(equip) && <X className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Agregar equipamiento personalizado..."
                value={newEquipamiento}
                onChange={(e) => setNewEquipamiento(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomEquipamiento())}
              />
              <Button type="button" variant="outline" onClick={addCustomEquipamiento}>
                Agregar
              </Button>
            </div>

            {formData.equipamiento.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.equipamiento.map((equip) => (
                  <Badge key={equip} variant="secondary">
                    {equip}
                    <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeEquipamiento(equip)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="disponible"
              checked={formData.disponible}
              onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="disponible" className="cursor-pointer">
              Sala disponible para reservas
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : mode === "create" ? "Crear Sala" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
