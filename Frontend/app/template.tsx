"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Prefetch de rutas comunes para navegación más rápida
    router.prefetch("/dashboard")
    router.prefetch("/admin")
    router.prefetch("/salas")
    router.prefetch("/mis-reservas")
  }, [router])

  return <>{children}</>
}
