"use client"

import { DashboardTemplate } from "@/components/templates/dashboard-template"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("current_user")
    if (!storedUser) {
      window.location.href = "/login"
      return
    }

    const user = JSON.parse(storedUser)
    if (user.rol.toLowerCase() !== "estudiante") {
      window.location.href = "/admin"
      return
    }

    setUsuario(user)
  }, [])

  if (!usuario) return null

  return (
    <DashboardTemplate>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard de Estudiante</h1>
        <p className="text-muted-foreground">Bienvenido al sistema de reserva de salas de estudio</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No tienes reservas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Sin reservas programadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salas Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Salas disponibles hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Historial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Reservas completadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Gestiona tus reservas de forma rápida</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => router.push("/salas")}>
              Buscar Salas Disponibles
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => router.push("/mis-reservas")}
            >
              Ver Mis Reservas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Próximas Reservas</CardTitle>
            <CardDescription>Tus reservas programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No tienes reservas programadas</p>
              <Button variant="link" className="mt-2" onClick={() => router.push("/salas")}>
                Crear una reserva
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  )
}
