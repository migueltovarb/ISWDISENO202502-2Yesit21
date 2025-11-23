"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { NavbarSimple } from "@/components/layout/navbar-simple"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { reservaService } from "@/lib/services/reserva-service"
import { salaService } from "@/lib/services/sala-service"
import type { IReserva, ISala } from "@/lib/types"
import { ArrowLeft, Search, Calendar, Clock, User, XCircle, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminReservasPage() {
  const router = useRouter()
  const [reservas, setReservas] = useState<IReserva[]>([])
  const [salas, setSalas] = useState<ISala[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [reservasData, salasData] = await Promise.all([reservaService.getReservas(), salaService.getSalas()])
      setReservas(reservasData)
      setSalas(salasData)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSalaInfo = (salaId: string) => {
    return salas.find((s) => s.id === salaId)
  }

  const getEstadoBadge = (estado: IReserva["estado"]) => {
    const variants = {
      confirmada: "default",
      pendiente: "secondary",
      cancelada: "destructive",
    } as const

    return <Badge variant={variants[estado]}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</Badge>
  }

  const filteredReservas = reservas.filter((reserva) => {
    const sala = getSalaInfo(reserva.salaId)
    const searchLower = searchTerm.toLowerCase()
    return (
      sala?.nombre.toLowerCase().includes(searchLower) ||
      reserva.usuarioId?.toLowerCase().includes(searchLower) ||
      reserva.estudiante?.nombre?.toLowerCase().includes(searchLower) ||
      reserva.estudiante?.email?.toLowerCase().includes(searchLower)
    )
  })

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

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Gestión de Reservas</h1>
            <p className="text-muted-foreground">Visualiza y administra todas las reservas del sistema</p>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por sala o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filteredReservas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No hay reservas en el sistema</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Todas las Reservas ({filteredReservas.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sala</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservas.map((reserva) => {
                      const sala = getSalaInfo(reserva.salaId)
                      const fechaInicio = new Date(reserva.fechaInicio)
                      const fechaFin = new Date(reserva.fechaFin)

                      return (
                        <TableRow key={reserva.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sala?.nombre}</p>
                              <p className="text-xs text-muted-foreground">{sala?.ubicacion}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{reserva.usuarioId}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {fechaInicio.toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
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
                          </TableCell>
                          <TableCell>{getEstadoBadge(reserva.estado)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {reserva.estado === "confirmada" && (
                                <Button variant="destructive" size="sm">
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
