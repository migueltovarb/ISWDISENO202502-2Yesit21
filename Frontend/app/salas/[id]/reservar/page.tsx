"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { ReservaForm } from "@/components/reservas/reserva-form"
import { Button } from "@/components/ui/button"
import { salaService } from "@/lib/services/sala-service"
import type { ISala } from "@/lib/types"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function ReservarSalaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [sala, setSala] = useState<ISala | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSala = async () => {
      try {
        const data = await salaService.getSalaById(params.id)
        setSala(data)
      } catch (error) {
        console.error("[v0] Error loading sala:", error)
      } finally {
        setLoading(false)
      }
    }
    loadSala()
  }, [params.id])

  if (loading) {
    return (
      <ProtectedRoute requiredRole="estudiante">
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!sala) {
    return (
      <ProtectedRoute requiredRole="estudiante">
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <p>Sala no encontrada</p>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!sala.disponible) {
    return (
      <ProtectedRoute requiredRole="estudiante">
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <Button variant="ghost" onClick={() => router.push(`/salas/${sala.id}`)} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <p>Esta sala no está disponible para reserva</p>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="estudiante">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8 max-w-4xl">
          <Button variant="ghost" onClick={() => router.push(`/salas/${sala.id}`)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a detalles de la sala
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Reservar {sala.nombre}</h1>
            <p className="text-muted-foreground">{sala.ubicacion}</p>
          </div>

          <ReservaForm sala={sala} />
        </main>
      </div>
    </ProtectedRoute>
  )
}
