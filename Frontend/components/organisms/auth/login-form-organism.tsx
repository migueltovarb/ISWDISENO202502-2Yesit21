"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormField } from "@/components/molecules/form-field"
import Link from "next/link"
import { toast } from "sonner"

function validateLogin(email: string, password: string): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!email) {
    errors.email = "El email es requerido"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email inválido"
  }

  if (!password) {
    errors.password = "La contraseña es requerida"
  } else if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres"
  }

  return errors
}

export function LoginFormOrganism() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Pre-llenar el email si viene del registro
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefillEmail = sessionStorage.getItem("prefill_email")
      if (prefillEmail) {
        setEmail(prefillEmail)
        sessionStorage.removeItem("prefill_email") // Limpiar después de usar
        
        // Mostrar mensaje informativo
        toast.info("Email detectado", {
          description: "Ingresa tu contraseña para iniciar sesión.",
          duration: 4000,
        })
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})

    const errors = validateLogin(email, password)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      // Llamar al backend real
      const { authService } = await import("@/lib/services/auth-service")
      
      console.log("Intentando login con:", email)
      const response = await authService.login(email, password)
      console.log("Login exitoso:", response)

      // Mostrar notificación de bienvenida
      toast.success(`¡Bienvenido, ${response.usuario.nombre}!`, {
        description: `Has iniciado sesión exitosamente como ${response.usuario.rol}.`,
        duration: 3000,
      })

      // Redirect después de mostrar notificación
      setTimeout(() => {
        const rol = response.usuario.rol?.toLowerCase() || "estudiante"
        console.log("Redirigiendo a:", rol === "administrador" ? "/admin" : "/dashboard")
        window.location.href = rol === "administrador" ? "/admin" : "/dashboard"
      }, 800)
    } catch (err: any) {
      console.error("Error en login:", err)
      
      let errorMessage = "Error al iniciar sesión. Verifica tus credenciales."
      
      if (err.response?.status === 401) {
        errorMessage = "Email o contraseña incorrectos."
      } else if (err.response?.status === 404) {
        errorMessage = "Usuario no encontrado. ¿Necesitas registrarte?"
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      toast.error("Error al iniciar sesión", {
        description: errorMessage,
        duration: 5000,
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} autoComplete="off">
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <FormField
            id="login-email-field"
            name="login-email-unique"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="tu@email.com"
            required
            error={fieldErrors.email}
            autoComplete="off"
          />
          <FormField
            id="login-password-field"
            name="login-password-unique"
            label="Contraseña"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
            error={fieldErrors.password}
            autoComplete="new-password"
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
          
          <Link href="/forgot-password" className="text-sm text-center text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>

          <p className="text-sm text-center text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
