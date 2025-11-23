"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthTemplate } from "@/components/templates/auth-template"
import { apiClient } from "@/lib/api/axios-config"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email) {
      setError("Por favor ingresa tu email")
      setLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido")
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.post("/auth/forgot-password", { email })
      
      setSuccess(true)
      setToken(response.data.token) // Solo para desarrollo
      
      toast.success("Solicitud enviada", {
        description: "Si el email existe, recibirás instrucciones para recuperar tu contraseña",
        duration: 5000,
      })

      // En desarrollo, redirigir automáticamente con el token
      if (response.data.token) {
        setTimeout(() => {
          router.push(`/reset-password?token=${response.data.token}&email=${email}`)
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data || "Error al procesar la solicitud")
      toast.error("Error", {
        description: "No se pudo procesar tu solicitud. Intenta de nuevo.",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTemplate
      title="Recuperar Contraseña"
      subtitle="Ingresa tu email para recibir instrucciones"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>
            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
          </CardDescription>
        </CardHeader>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-9"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar instrucciones"
                )}
              </Button>

              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full" disabled={loading}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio de sesión
                </Button>
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription className="space-y-2">
                <p className="font-medium">✅ Solicitud enviada</p>
                <p className="text-sm">
                  Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
                </p>
                {token && (
                  <p className="text-xs text-muted-foreground mt-2">
                    🔧 Modo desarrollo: Redirigiendo automáticamente...
                  </p>
                )}
              </AlertDescription>
            </Alert>

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Button>
            </Link>
          </CardContent>
        )}
      </Card>
    </AuthTemplate>
  )
}
