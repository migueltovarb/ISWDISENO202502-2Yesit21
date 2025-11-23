"use client"

import { DashboardTemplate } from "@/components/templates/dashboard-template"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { statsService } from "@/lib/services/stats-service"

export default function AdminPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    reservasHoy: { total: 0, pendientes: 0 },
    reservasPendientes: { total: 0, proximas: 0 },
    salas: { total: 0, disponibles: 0 },
    tasaOcupacion: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("current_user")
    if (!storedUser) {
      window.location.href = "/login"
      return
    }

    const user = JSON.parse(storedUser)
    if (user.rol.toLowerCase() !== "administrador") {
      window.location.href = "/dashboard"
      return
    }

    setUsuario(user)
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const [totalUsuarios, reservasHoy, reservasPendientes, salas, tasaOcupacion] = await Promise.all([
        statsService.getTotalUsuarios(),
        statsService.getReservasHoy(),
        statsService.getReservasPendientes(),
        statsService.getSalasStats(),
        statsService.getTasaOcupacion(),
      ])

      setStats({
        totalUsuarios,
        reservasHoy,
        reservasPendientes,
        salas,
        tasaOcupacion,
      })
    } catch (error) {
      console.error("Error cargando estadísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!usuario) return null

  return (
    <DashboardTemplate>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona salas, reservas y usuarios del sistema</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/admin/usuarios")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                stats.totalUsuarios
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsuarios === 0 ? "Sin usuarios registrados" : "usuarios registrados"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                stats.reservasPendientes.total
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.reservasPendientes.total > 0
                ? `${stats.reservasPendientes.proximas} próximas`
                : "Sin reservas pendientes"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.salas.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.salas.disponibles} de {stats.salas.total} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasaOcupacion}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.tasaOcupacion === 0 ? "Sin ocupación" : "basado en reservas activas"}
            </p>
          </CardContent>
        </Card>
      </div>

      {stats.reservasPendientes.total === 0 && (
        <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  ¿No ves reservas pendientes?
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Si hay reservas sin estado, puedes corregirlas automáticamente
                </p>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const { apiClient } = await import("@/lib/api/axios-config")
                    await apiClient.post("/admin/reservas/corregir-sin-estado")
                    loadStats()
                    alert("Reservas corregidas exitosamente")
                  } catch (error) {
                    console.error("Error:", error)
                    alert("Error al corregir reservas")
                  }
                }}
              >
                Corregir Reservas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/salas")}>
          <CardHeader>
            <CardTitle>Gestión de Salas</CardTitle>
            <CardDescription>Administra las salas de estudio disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Gestionar Salas
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/admin/reservas")}
        >
          <CardHeader>
            <CardTitle>Gestión de Reservas</CardTitle>
            <CardDescription>Visualiza y administra todas las reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Ver Reservas
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/admin/usuarios")}
        >
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>Administra los usuarios del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Gestionar Usuarios
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  )
}
