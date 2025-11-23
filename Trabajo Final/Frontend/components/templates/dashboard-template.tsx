import type React from "react"
import { NavbarSimple } from "@/components/layout/navbar-simple"

interface DashboardTemplateProps {
  children: React.ReactNode
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarSimple />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
