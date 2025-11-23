"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/auth-service"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "estudiante" | "administrador"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    const user = authService.getCurrentUser()

    if (!token || !user) {
      router.push("/login")
      return
    }

    if (requiredRole && user.rol.toLowerCase() !== requiredRole.toLowerCase()) {
      if (user.rol.toLowerCase() === "administrador") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      return
    }

    setIsAuthorized(true)
    setIsLoading(false)
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
