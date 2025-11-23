"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { NavbarSimple } from "@/components/layout/navbar-simple"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { usuarioService } from "@/lib/services/usuario-service"
import type { IUsuario } from "@/lib/types"
import { ArrowLeft, Search, Mail, UserCircle, Shield, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminUsuariosPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [usuarios, setUsuarios] = useState<IUsuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      const data = await usuarioService.getUsuarios()
      setUsuarios(data)
    } catch (error) {
      console.error("Error loading usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <h1 className="text-3xl font-bold mb-2">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra los usuarios del sistema</p>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ) : filteredUsuarios.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UserCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Usuarios Registrados ({filteredUsuarios.length})</CardTitle>
              </CardHeader>
              <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{usuario.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{usuario.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            usuario.rol?.toLowerCase() === "administrador" ||
                            usuario.rol?.toUpperCase() === "ADMINISTRADOR"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {(usuario.rol?.toLowerCase() === "administrador" ||
                            usuario.rol?.toUpperCase() === "ADMINISTRADOR") && <Shield className="mr-1 h-3 w-3" />}
                          {usuario.rol?.charAt(0).toUpperCase() + usuario.rol?.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{usuario.carrera || "-"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {usuario.fechaCreacion
                            ? new Date(usuario.fechaCreacion).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
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
