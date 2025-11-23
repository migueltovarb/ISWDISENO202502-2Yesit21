"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  fallbackPath?: string
}

export function AuthGuard({ children, fallbackPath = "/login" }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(fallbackPath)
    }
  }, [isAuthenticated, router, fallbackPath])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
