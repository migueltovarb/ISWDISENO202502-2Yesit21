"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { NavbarSimple } from "@/components/layout/navbar-simple"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { salaService } from "@/lib/services/sala-service"
import { SalaDialog } from "@/components/admin/sala-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ISala } from "@/lib/types"
import { ArrowLeft, Plus, Search, Edit, Trash2, Users, MapPin, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function AdminSalasPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [salas, setSalas] = useState<ISala[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedSala, setSelectedSala] = useState<ISala | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [salaToDelete, setSalaToDelete] = useState<ISala | null>(null)

  useEffect(() => {
    loadSalas()
  }, [])

  const loadSalas = async () => {
    try {
      const data = await salaService.getSalas()
      setSalas(data)
    } catch (error) {
      console.error("Error loading salas:", error)
      toast.error("Error al cargar salas")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSala = () => {
    setSelectedSala(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleEditSala = (sala: ISala) => {
    setSelectedSala(sala)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleDeleteClick = (sala: ISala) => {
    setSalaToDelete(sala)
    setDeleteDialogOpen(true)
  }

  const handleSaveSala = async (salaData: Partial<ISala>) => {
    try {
      if (dialogMode === "create") {
        await salaService.createSala(salaData as Omit<ISala, "id">)
        toast.success("Sala creada exitosamente")
      } else if (selectedSala) {
        await salaService.updateSala(selectedSala.id, salaData)
        toast.success("Sala actualizada exitosamente")
      }
      await loadSalas()
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la sala")
      throw error
    }
  }

  const handleConfirmDelete = async () => {
    if (!salaToDelete) return

    try {
      await salaService.deleteSala(salaToDelete.id)
      toast.success(`Sala "${salaToDelete.nombre}" eliminada exitosamente`)
      await loadSalas()
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar la sala")
    } finally {
      setDeleteDialogOpen(false)
      setSalaToDelete(null)
    }
  }

  const filteredSalas = salas.filter(
    (sala) =>
      sala.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sala.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <ProtectedRoute requiredRole="administrador">
        <div className="min-h-screen bg-background">
          <NavbarSimple />
          <main className="container py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="administrador">
      <div className="min-h-screen bg-background">
        <NavbarSimple />
        <main className="container py-8">
          <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestión de Salas</h1>
              <p className="text-muted-foreground">Administra las salas de estudio del sistema</p>
            </div>
            <Button onClick={handleCreateSala}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Sala
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar salas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSalas.map((sala) => (
              <Card key={sala.id} className="overflow-hidden">
                <div className="relative h-48 w-full bg-muted">
                  <Image src={sala.imagen || "/placeholder.svg"} alt={sala.nombre} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge variant={sala.disponible ? "default" : "secondary"}>
                      {sala.disponible ? "Disponible" : "Ocupada"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{sala.nombre}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{sala.ubicacion}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Capacidad: {sala.capacidad} personas</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {sala.equipamiento && sala.equipamiento.length > 0 ? (
                      <>
                        {sala.equipamiento.slice(0, 2).map((equip, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {equip}
                          </Badge>
                        ))}
                        {sala.equipamiento.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{sala.equipamiento.length - 2}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin equipamiento</span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleEditSala(sala)}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDeleteClick(sala)}>
                      <Trash2 className="mr-2 h-3 w-3" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <SalaDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleSaveSala}
            sala={selectedSala}
            mode={dialogMode}
          />

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar sala?</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de que deseas eliminar la sala "{salaToDelete?.nombre}"? Esta acción no se puede
                  deshacer y se eliminarán todas las reservas asociadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </ProtectedRoute>
  )
}
