"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter()
  const { isAuthenticated, usuario } = useAuth()

  useEffect(() => {
    if (isAuthenticated && usuario) {
      const redirectPath = usuario.rol === "administrador" ? "/admin" : "/dashboard"
      router.push(redirectPath)
    }
  }, [isAuthenticated, usuario, router])

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}
