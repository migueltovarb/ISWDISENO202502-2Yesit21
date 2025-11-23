"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ("estudiante" | "administrador")[]
  fallbackPath?: string
}

export function RoleGuard({ children, allowedRoles, fallbackPath = "/dashboard" }: RoleGuardProps) {
  const router = useRouter()
  const { usuario, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (usuario && !allowedRoles.includes(usuario.rol)) {
      router.push(fallbackPath)
    }
  }, [usuario, isAuthenticated, allowedRoles, router, fallbackPath])

  if (!isAuthenticated || !usuario || !allowedRoles.includes(usuario.rol)) {
    return null
  }

  return <>{children}</>
}
