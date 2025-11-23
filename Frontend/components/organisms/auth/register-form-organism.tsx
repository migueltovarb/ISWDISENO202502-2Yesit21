"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormField } from "@/components/molecules/form-field"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

function validateRegister(formData: {
  nombre: string
  apellido: string
  email: string
  password: string
  telefono: string
  carrera: string
  rol: string
}): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!formData.nombre || formData.nombre.length < 2) {
    errors.nombre = "El nombre debe tener al menos 2 caracteres"
  }

  if (!formData.apellido || formData.apellido.length < 2) {
    errors.apellido = "El apellido debe tener al menos 2 caracteres"
  }

  if (!formData.email) {
    errors.email = "El email es requerido"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Email inválido"
  }

  if (!formData.password) {
    errors.password = "La contraseña es requerida"
  } else if (formData.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres"
  }

  return errors
}

function sanitizeString(str: string): string {
  return str.replace(/[<>]/g, "")
}

export function RegisterFormOrganism() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    carrera: "",
    rol: "estudiante" as "estudiante" | "administrador",
  })
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})

    const errors = validateRegister(formData)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      // Llamar al backend real
      const { authService } = await import("@/lib/services/auth-service")
      
      const registerData = {
        nombre: sanitizeString(formData.nombre),
        apellido: sanitizeString(formData.apellido),
        email: sanitizeString(formData.email),
        password: formData.password,
        telefono: formData.telefono || undefined,
        carrera: formData.rol === "estudiante" ? sanitizeString(formData.carrera) : undefined,
        rol: formData.rol,
      }
      
      console.log("Datos de registro:", registerData)
      const response = await authService.register(registerData)
      console.log("Registro exitoso:", response)

      toast.success("¡Cuenta creada exitosamente!", {
        description: `Bienvenido ${response.usuario.nombre}. Redirigiendo...`,
        duration: 3000,
      })

      // Redirect después del registro exitoso
      setTimeout(() => {
        const rol = response.usuario.rol?.toLowerCase() || "estudiante"
        window.location.href = rol === "administrador" ? "/admin" : "/dashboard"
      }, 800)
    } catch (err: any) {
      console.error("Error en registro:", err)
      
      let errorMessage = "Error al registrarse. Intenta de nuevo."
      
      if (err.message.includes("ya está registrado")) {
        errorMessage = "Este email ya está registrado."
        
        // Guardar el email en sessionStorage para pre-llenarlo en login
        if (typeof window !== "undefined") {
          sessionStorage.setItem("prefill_email", formData.email)
        }
        
        toast.error("Email ya registrado", {
          description: "Este email ya tiene una cuenta. Redirigiendo al login...",
          duration: 3000,
        })
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
        return
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      toast.error("Error al registrarse", {
        description: errorMessage,
        duration: 5000,
      })
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>Completa el formulario para registrarte</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} autoComplete="off">
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="rol">Tipo de Usuario</Label>
            <Select value={formData.rol} onValueChange={(value) => updateField("rol", value)}>
              <SelectTrigger id="rol">
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estudiante">Estudiante</SelectItem>
                <SelectItem value="administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {formData.rol === "estudiante"
                ? "Podrás buscar y reservar salas de estudio"
                : "Tendrás acceso al panel de administración"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={(v) => updateField("nombre", v)}
              required
              error={fieldErrors.nombre}
            />
            <FormField
              id="apellido"
              label="Apellido"
              value={formData.apellido}
              onChange={(v) => updateField("apellido", v)}
              required
              error={fieldErrors.apellido}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email-register" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email-register"
              name="email-register"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="off"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500">{fieldErrors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password-register" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              id="password-register"
              name="password-register"
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-500">{fieldErrors.password}</p>
            )}
          </div>
          <FormField
            id="telefono"
            label="Teléfono"
            type="tel"
            value={formData.telefono}
            onChange={(v) => updateField("telefono", v)}
            placeholder="555-0000"
            error={fieldErrors.telefono}
          />

          {formData.rol === "estudiante" && (
            <FormField
              id="carrera"
              label="Carrera"
              value={formData.carrera}
              onChange={(v) => updateField("carrera", v)}
              placeholder="Ingeniería"
              error={fieldErrors.carrera}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
