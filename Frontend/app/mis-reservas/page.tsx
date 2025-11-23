"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardTemplate } from "@/components/templates/dashboard-template"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { reservaService } from "@/lib/services/reserva-service"
import { salaService } from "@/lib/services/sala-service"
import { authService } from "@/lib/services/auth-service"
import { CountdownTimer } from "@/components/reservas/countdown-timer"
import type { IReserva, ISala } from "@/lib/types"
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
import { toast } from "sonner"

export default function MisReservasPage() {
  const router = useRouter()
  const [reservas, setReservas] = useState<IReserva[]>([])
  const [salas, setSalas] = useState<ISala[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [reservaToCancel, setReservaToCancel] = useState<string | null>(null)

  useEffect(() => {
    // Verificar autenticación
    const storedUser = localStorage.getItem("current_user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    try {
      const [reservasData, salasData] = await Promise.all([
        reservaService.getReservasByUsuario(user.id),
        salaService.getSalas(),
      ])
      setReservas(reservasData)
      setSalas(salasData)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReserva = async (reservaId: string) => {
    setCancelingId(reservaId)
    try {
      const reserva = reservas.find(r => r.id === reservaId)
      const sala = reserva ? getSalaInfo(reserva.salaId) : null
      
      await reservaService.cancelReserva(reservaId, "Cancelada por el usuario")
      
      toast.success("Reserva Cancelada", {
        description: sala 
          ? `Tu reserva para ${sala.nombre} ha sido cancelada exitosamente.`
          : "La reserva ha sido cancelada exitosamente.",
        duration: 4000,
      })
      
      await loadData()
    } catch (error: any) {
      toast.error("Error al cancelar", {
        description: error.message || "No se pudo cancelar la reserva. Intenta de nuevo.",
        duration: 5000,
      })
    } finally {
      setCancelingId(null)
      setReservaToCancel(null)
    }
  }

  const getSalaInfo = (salaId?: string) => {
    if (!salaId) return null
    return salas.find((s) => s.id === salaId)
  }

  const getEstadoBadge = (estado: IReserva["estado"]) => {
    if (!estado) return <Badge variant="secondary">Sin estado</Badge>
    
    const estadoLower = estado.toLowerCase()
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      confirmada: "default",
      activa: "default",
      pendiente: "secondary",
      cancelada: "destructive",
      completada: "secondary",
    }

    const variant = variants[estadoLower] || "secondary"
    return <Badge variant={variant}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</Badge>
  }

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
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6">
            ← Volver al Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mis Reservas</h1>
            <p className="text-muted-foreground">Gestiona tus reservas de salas de estudio</p>
          </div>

          {reservas.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No tienes reservas</h3>
                  <p className="text-muted-foreground mb-4">Comienza reservando una sala de estudio</p>
                  <Button onClick={() => router.push("/salas")}>Buscar Salas</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reservas
                .filter((reserva) => {
                  // Filtrar reservas canceladas y completadas
                  const estado = reserva.estado?.toUpperCase()
                  return estado !== "CANCELADA" && estado !== "COMPLETADA"
                })
                .map((reserva) => {
                const salaId = reserva.salaId || reserva.sala?.id
                const sala = getSalaInfo(salaId)
                const fechaInicio = new Date(reserva.fechaInicio)
                const fechaFin = new Date(reserva.fechaFin)

                return (
                  <Card key={reserva.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{sala?.nombre || "Sala desconocida"}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>{sala?.ubicacion}</span>
                          </div>
                        </div>
                        {getEstadoBadge(reserva.estado)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span>📅</span>
                          <span>
                            {fechaInicio.toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span>🕐</span>
                          <span>
                            {fechaInicio.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {fechaFin.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {reserva.motivo && (
                        <div className="text-sm">
                          <span className="font-medium">Motivo: </span>
                          <span className="text-muted-foreground">{reserva.motivo}</span>
                        </div>
                      )}

                      {/* Contador de tiempo restante */}
                      <CountdownTimer
                        fechaInicio={reserva.fechaInicio}
                        fechaFin={reserva.fechaFin}
                        estado={reserva.estado}
                      />

                      {/* Botones para reservas con estado válido */}
                      {reserva.estado && 
                       (reserva.estado.toUpperCase() === "CONFIRMADA" || 
                        reserva.estado.toUpperCase() === "ACTIVA" || 
                        reserva.estado.toUpperCase() === "PENDIENTE") && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/salas/${salaId}`)}>
                            Ver Sala
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setReservaToCancel(reserva.id)}
                            disabled={cancelingId === reserva.id}
                          >
                            {cancelingId === reserva.id ? "Cancelando..." : "Cancelar Reserva"}
                          </Button>
                        </div>
                      )}

                      {/* Botón para reservas sin estado */}
                      {!reserva.estado && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/salas/${salaId}`)}>
                            Ver Sala
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setReservaToCancel(reserva.id)}
                            disabled={cancelingId === reserva.id}
                          >
                            {cancelingId === reserva.id ? "Eliminando..." : "Eliminar Reserva"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <AlertDialog open={!!reservaToCancel} onOpenChange={() => setReservaToCancel(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La reserva será cancelada y la sala quedará disponible para otros
                  usuarios.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, mantener reserva</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => reservaToCancel && handleCancelReserva(reservaToCancel)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sí, cancelar reserva
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    </DashboardTemplate>
  )
}
