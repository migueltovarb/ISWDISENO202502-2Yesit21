"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/services/auth-service"
import { User, LogOut, ChevronDown } from "lucide-react"
import type { IUsuario } from "@/lib/types"

export function NavbarSimple() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<IUsuario | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setUsuario(user)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    router.push("/login")
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link 
          href={usuario?.rol?.toLowerCase() === "administrador" ? "/admin" : "/dashboard"} 
          className="text-lg md:text-xl font-bold hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-none"
        >
          <span className="hidden sm:inline">Sistema de Reservas</span>
          <span className="sm:hidden">Reservas</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {usuario?.rol?.toLowerCase() === "estudiante" && (
            <>
              <Link href="/salas" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="md:text-base">Salas</Button>
              </Link>
              <Link href="/mis-reservas" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="md:text-base">Mis Reservas</Button>
              </Link>
            </>
          )}

          {usuario?.rol?.toLowerCase() === "administrador" && (
            <>
              <Link href="/admin/salas" className="hidden md:block">
                <Button variant="ghost" size="sm">Salas</Button>
              </Link>
              <Link href="/admin/reservas" className="hidden md:block">
                <Button variant="ghost" size="sm">Reservas</Button>
              </Link>
              <Link href="/admin/usuarios" className="hidden lg:block">
                <Button variant="ghost" size="sm">Usuarios</Button>
              </Link>
            </>
          )}

          {/* Menú de usuario con dropdown manual */}
          <div className="relative">
            <Button 
              variant="outline" 
              className="gap-1 md:gap-2 text-sm md:text-base"
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <User className="h-4 w-4" />
              <span className="max-w-[80px] sm:max-w-[120px] truncate">{usuario?.nombre || "Usuario"}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </Button>

            {menuOpen && (
              <>
                {/* Overlay para cerrar el menú al hacer clic fuera */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setMenuOpen(false)}
                />
                
                {/* Menú desplegable */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50 py-1">
                  {/* Información del usuario */}
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium">
                      {usuario?.nombre} {usuario?.apellido || ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {usuario?.email || ""}
                    </p>
                  </div>

                  {/* Opción Ver Perfil */}
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      router.push("/perfil")
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Ver Perfil
                  </button>

                  <div className="border-t my-1" />

                  {/* Opción Cerrar Sesión */}
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
