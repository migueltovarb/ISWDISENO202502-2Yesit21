import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ErrorBoundary } from "@/components/molecules/error-boundary"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/auth-context"

export const metadata: Metadata = {
  title: "Sistema de Reserva de Salas",
  description: "Gestiona tus reservas de salas de estudio",
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#ffffff',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  )
}
