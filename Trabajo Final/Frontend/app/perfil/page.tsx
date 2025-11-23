"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2, User, Mail, Phone, BookOpen, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [carrera, setCarrera] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("current_user")
    if (!storedUser) {
      window.location.href = "/login"
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)
    setNombre(userData.nombre)
    setEmail(userData.email)
    setTelefono(userData.telefono || "")
    setCarrera(userData.carrera || "")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const updatedUser = {
        ...user,
        nombre,
        email,
        telefono,
        carrera,
      }

      localStorage.setItem("current_user", JSON.stringify(updatedUser))

      const usersData = localStorage.getItem("mock_users")
      if (usersData) {
        const users = JSON.parse(usersData)
        const userIndex = users.findIndex((u: any) => u.id === user.id)
        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem("mock_users", JSON.stringify(users))
        }
      }

      setUser(updatedUser)

      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido guardados exitosamente",
      })
    } catch (err) {
      setError("Error al actualizar el perfil. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8 max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => router.push(user?.rol === "administrador" ? "/admin" : "/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground">Gestiona tu información personal</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
                <CardDescription>Información básica de tu cuenta en el sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">ID de Usuario</Label>
                    <p className="text-sm font-mono">{user?.id}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Rol</Label>
                    <p className="text-sm capitalize">{user?.rol}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tus datos personales</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">
                        <User className="inline h-4 w-4 mr-2" />
                        Nombre Completo
                      </Label>
                      <Input
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        disabled={loading}
                      />
                    </div>

                    {user?.rol === "estudiante" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="telefono">
                            <Phone className="inline h-4 w-4 mr-2" />
                            Teléfono
                          </Label>
                          <Input
                            id="telefono"
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="555-0000"
                            disabled={loading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="carrera">
                            <BookOpen className="inline h-4 w-4 mr-2" />
                            Carrera
                          </Label>
                          <Input
                            id="carrera"
                            value={carrera}
                            onChange={(e) => setCarrera(e.target.value)}
                            placeholder="Ej: Ingeniería de Sistemas"
                            disabled={loading}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
                <CardDescription>Tu actividad en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Reservas Activas</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Reservas Completadas</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Horas Reservadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
