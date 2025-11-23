"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarPicker } from "./calendar-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { reservaService } from "@/lib/services/reserva-service"
import type { ISala } from "@/lib/types"
import { Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ReservaFormProps {
  sala: ISala
}

export function ReservaForm({ sala }: ReservaFormProps) {
  const router = useRouter()
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null)
  const [fechaFin, setFechaFin] = useState<Date | null>(null)
  const [motivo, setMotivo] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [reservasExistentes, setReservasExistentes] = useState<any[]>([])

  // Cargar reservas existentes de la sala
  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const reservas = await reservaService.getReservasBySala(sala.id)
        setReservasExistentes(reservas)
      } catch (error) {
        console.error("Error cargando reservas:", error)
      }
    }
    cargarReservas()
  }, [sala.id])

  const handleDateTimeSelect = (inicio: Date, fin: Date) => {
    setFechaInicio(inicio)
    setFechaFin(fin)
    setError("")
  }

  const handleSubmit = async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Por favor selecciona fecha y hora")
      return
    }

    if (fechaFin <= fechaInicio) {
      setError("La hora de fin debe ser posterior a la hora de inicio")
      return
    }

    // Validar que no exceda 3 horas
    const diffHours = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60)
    if (diffHours > 3) {
      setError("La reserva no puede exceder 3 horas")
      toast.error("Límite excedido", {
        description: "Las reservas tienen un máximo de 3 horas",
        duration: 5000,
      })
      return
    }

    setLoading(true)
    setError("")

    try {
      await reservaService.createReserva({
        salaId: sala.id,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        motivo,
      })

      // Notificación de éxito con detalles
      const fechaFormateada = format(fechaInicio, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })
      
      toast.success("¡Reserva Confirmada! 🎉", {
        description: `Tu reserva para ${sala.nombre} el ${fechaFormateada} ha sido confirmada. Recibirás recordatorios antes de tu reserva.`,
        duration: 6000,
      })

      // Esperar un momento para que el usuario vea la notificación
      setTimeout(() => {
        router.push("/mis-reservas")
      }, 1500)
    } catch (err: any) {
      const errorMsg = err.message || "Error al crear la reserva. Por favor intenta de nuevo."
      setError(errorMsg)
      
      toast.error("Error al crear reserva", {
        description: errorMsg,
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <CalendarPicker 
        onDateTimeSelect={handleDateTimeSelect} 
        reservasExistentes={reservasExistentes}
      />

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo de la reserva (opcional)</Label>
            <Textarea
              id="motivo"
              placeholder="Ej: Reunión de grupo, estudio para examen..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
            />
          </div>

          {fechaInicio && fechaFin && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-medium">Resumen de la reserva</span>
              </div>
              <div className="text-sm space-y-1 ml-6">
                <p>Sala: {sala.nombre}</p>
                <p>
                  Fecha:{" "}
                  {fechaInicio.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  Horario:{" "}
                  {fechaInicio.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {fechaFin.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}

          <Button onClick={handleSubmit} disabled={!fechaInicio || !fechaFin || loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirmando reserva...
              </>
            ) : (
              "Confirmar Reserva"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
