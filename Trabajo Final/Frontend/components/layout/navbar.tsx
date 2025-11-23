"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { authService } from "@/lib/services/auth-service"
import { User, LogOut, UserCircle } from "lucide-react"
import type { IUsuario } from "@/lib/types"

export function Navbar() {
  const router = useRouter()
  const { usuario: usuarioContext, logout: logoutContext } = useAuth()
  const [usuario, setUsuario] = useState<IUsuario | null>(null)

  useEffect(() => {
    // Intentar obtener usuario del contexto o localStorage
    if (usuarioContext) {
      setUsuario(usuarioContext)
    } else {
      const user = authService.getCurrentUser()
      if (user) {
        setUsuario(user)
      }
    }
  }, [usuarioContext])

  const handleLogout = () => {
    if (logoutContext) {
      logoutContext()
    } else {
      authService.logout()
    }
    router.push("/login")
  }

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={usuario?.rol?.toLowerCase() === "administrador" ? "/admin" : "/dashboard"} className="text-xl font-bold">
          Sistema de Reservas
        </Link>

        <div className="flex items-center gap-4">
          {usuario?.rol?.toLowerCase() === "estudiante" && (
            <>
              <Link href="/salas">
                <Button variant="ghost">Salas</Button>
              </Link>
              <Link href="/mis-reservas">
                <Button variant="ghost">Mis Reservas</Button>
              </Link>
            </>
          )}

          {usuario?.rol?.toLowerCase() === "administrador" && (
            <>
              <Link href="/admin/salas">
                <Button variant="ghost">Gestionar Salas</Button>
              </Link>
              <Link href="/admin/reservas">
                <Button variant="ghost">Gestionar Reservas</Button>
              </Link>
              <Link href="/admin/usuarios">
                <Button variant="ghost">Usuarios</Button>
              </Link>
            </>
          )}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 cursor-pointer">
                <UserCircle className="h-4 w-4" />
                {usuario?.nombre || "Usuario"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" sideOffset={5}>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {usuario?.nombre} {usuario?.apellido || ""}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {usuario?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onSelect={() => router.push("/perfil")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Ver Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
