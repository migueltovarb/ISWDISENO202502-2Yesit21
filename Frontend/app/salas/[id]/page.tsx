"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { salaService } from "@/lib/services/sala-service"
import type { ISala } from "@/lib/types"
import { ArrowLeft, Users, MapPin, Calendar, Loader2 } from "lucide-react"
import Image from "next/image"

export default function SalaDetailPage({ params }: { params: { id: string } }) {
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

  return (
    <ProtectedRoute requiredRole="estudiante">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <Button variant="ghost" onClick={() => router.push("/salas")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la búsqueda
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="relative h-96 w-full bg-muted">
                  <Image
                    src={sala.imagen || "/placeholder.svg"}
                    alt={sala.nombre}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{sala.nombre}</CardTitle>
                      <div className="flex items-center gap-2 text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{sala.ubicacion}</span>
                      </div>
                    </div>
                    <Badge variant={sala.disponible ? "default" : "secondary"} className="text-sm">
                      {sala.disponible ? "Disponible" : "Ocupada"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Capacidad: {sala.capacidad} personas</span>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Equipamiento disponible</h3>
                    <div className="flex flex-wrap gap-2">
                      {sala.equipamiento && sala.equipamiento.length > 0 ? (
                        sala.equipamiento.map((equip, index) => (
                          <Badge key={index} variant="outline">
                            {equip}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin equipamiento especificado</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Reservar Sala</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sala.disponible ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Esta sala está disponible para reserva. Selecciona fecha y hora para continuar.
                      </p>
                      <Button className="w-full" size="lg" onClick={() => router.push(`/salas/${sala.id}/reservar`)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Seleccionar Fecha y Hora
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Esta sala no está disponible en este momento</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
