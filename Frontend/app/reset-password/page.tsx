"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthTemplate } from "@/components/templates/auth-template"
import { apiClient } from "@/lib/api/axios-config"
import { Lock, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [email, setEmail] = useState("")

  const token = searchParams.get("token")

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Token inválido o faltante")
        setVerifying(false)
        return
      }

      try {
        const response = await apiClient.post("/auth/verify-token", { token })
        setTokenValid(true)
        setEmail(response.data.email)
      } catch (err: any) {
        setError(err.response?.data || "Token inválido o expirado")
        setTokenValid(false)
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        newPassword: password,
      })

      setSuccess(true)
      
      toast.success("¡Contraseña actualizada!", {
        description: "Tu contraseña ha sido restablecida exitosamente",
        duration: 5000,
      })

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data || "Error al restablecer la contraseña")
      toast.error("Error", {
        description: "No se pudo restablecer tu contraseña. Intenta de nuevo.",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <AuthTemplate title="Verificando..." subtitle="Por favor espera">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verificando token...</p>
            </div>
          </CardContent>
        </Card>
      </AuthTemplate>
    )
  }

  if (!tokenValid) {
    return (
      <AuthTemplate title="Token Inválido" subtitle="No se puede restablecer la contraseña">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <Alert variant="destructive">
              <AlertDescription className="space-y-2">
                <p className="font-medium">❌ {error}</p>
                <p className="text-sm">
                  El enlace puede haber expirado o ser inválido. Por favor solicita uno nuevo.
                </p>
              </AlertDescription>
            </Alert>

            <div className="mt-6 space-y-2">
              <Link href="/forgot-password" className="block">
                <Button className="w-full">Solicitar nuevo enlace</Button>
              </Link>
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">Volver al inicio de sesión</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </AuthTemplate>
    )
  }

  if (success) {
    return (
      <AuthTemplate title="¡Listo!" subtitle="Tu contraseña ha sido actualizada">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Contraseña actualizada</h3>
                <p className="text-sm text-muted-foreground">
                  Tu contraseña ha sido restablecida exitosamente. Redirigiendo al inicio de sesión...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AuthTemplate>
    )
  }

  return (
    <AuthTemplate title="Nueva Contraseña" subtitle="Ingresa tu nueva contraseña">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Restablecer Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña para {email}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Restablecer Contraseña"
              )}
            </Button>

            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full" disabled={loading}>
                Cancelar
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </AuthTemplate>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthTemplate title="Cargando..." subtitle="Por favor espera">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </AuthTemplate>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
