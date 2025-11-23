"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format, isSameDay, isAfter, isBefore, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, Calendar as CalendarIcon, AlertCircle } from "lucide-react"

interface CalendarPickerProps {
  onDateTimeSelect: (fechaInicio: Date, fechaFin: Date) => void
  selectedDate?: Date
  reservasExistentes?: Array<{ fechaInicio: string; fechaFin: string }>
}

export function CalendarPicker({ onDateTimeSelect, selectedDate, reservasExistentes = [] }: CalendarPickerProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate)
  const [horaInicio, setHoraInicio] = useState<string>("09:00")
  const [horaFin, setHoraFin] = useState<string>("10:00")
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([])

  // Generar todas las horas disponibles (8:00 AM - 8:00 PM)
  // Para sábados solo hasta 12:00 PM
  const generarHorasDisponibles = (fecha?: Date) => {
    if (!fecha) {
      return Array.from({ length: 13 }, (_, i) => {
        const hora = i + 8
        return `${hora.toString().padStart(2, "0")}:00`
      })
    }

    const diaSemana = fecha.getDay() // 0 = Domingo, 6 = Sábado
    
    // Sábado: solo hasta 12:00 PM (8:00 - 12:00)
    if (diaSemana === 6) {
      return Array.from({ length: 5 }, (_, i) => {
        const hora = i + 8
        return `${hora.toString().padStart(2, "0")}:00`
      })
    }
    
    // Lunes a Viernes: 8:00 AM - 8:00 PM
    return Array.from({ length: 13 }, (_, i) => {
      const hora = i + 8
      return `${hora.toString().padStart(2, "0")}:00`
    })
  }

  const todasLasHoras = generarHorasDisponibles(date)

  // Calcular horas disponibles según la fecha seleccionada
  useEffect(() => {
    if (!date) {
      setHorasDisponibles(generarHorasDisponibles())
      return
    }

    const ahora = new Date()
    const esHoy = isSameDay(date, ahora)
    
    // Generar horas según el día de la semana
    let horasFiltradas = generarHorasDisponibles(date)

    // Si es hoy, filtrar horas pasadas
    if (esHoy) {
      const horaActual = ahora.getHours()
      const minutoActual = ahora.getMinutes()
      
      horasFiltradas = horasFiltradas.filter(hora => {
        const [h] = hora.split(":").map(Number)
        // Permitir solo horas futuras (con al menos 30 minutos de margen)
        return h > horaActual || (h === horaActual && minutoActual < 30)
      })
    }

    setHorasDisponibles(horasFiltradas)

    // Ajustar hora de inicio si la actual ya no está disponible
    if (!horasFiltradas.includes(horaInicio) && horasFiltradas.length > 0) {
      setHoraInicio(horasFiltradas[0])
      
      // Ajustar hora fin también
      const nuevaHoraFinIndex = horasFiltradas.indexOf(horasFiltradas[0]) + 1
      if (nuevaHoraFinIndex < horasFiltradas.length) {
        setHoraFin(horasFiltradas[nuevaHoraFinIndex])
      }
    }
  }, [date])

  // Validar que la fecha/hora de inicio no sea en el pasado
  const validarFechaHora = (fecha: Date, hora: string): boolean => {
    const [h, m] = hora.split(":").map(Number)
    const fechaHora = new Date(fecha)
    fechaHora.setHours(h, m, 0, 0)
    
    return isAfter(fechaHora, new Date())
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      // Esperar a que se actualicen las horas disponibles
      setTimeout(() => {
        updateDateTime(newDate, horaInicio, horaFin)
      }, 100)
    }
  }

  const handleHoraInicioChange = (hora: string) => {
    setHoraInicio(hora)
    
    // Ajustar hora fin si es menor o igual a hora inicio
    const horaInicioNum = parseInt(hora.split(":")[0])
    const horaFinNum = parseInt(horaFin.split(":")[0])
    
    if (horaFinNum <= horaInicioNum) {
      const nuevaHoraFin = `${(horaInicioNum + 1).toString().padStart(2, "0")}:00`
      if (horasDisponibles.includes(nuevaHoraFin)) {
        setHoraFin(nuevaHoraFin)
        if (date) {
          updateDateTime(date, hora, nuevaHoraFin)
        }
        return
      }
    }
    
    if (date) {
      updateDateTime(date, hora, horaFin)
    }
  }

  const handleHoraFinChange = (hora: string) => {
    setHoraFin(hora)
    if (date) {
      updateDateTime(date, horaInicio, hora)
    }
  }

  const updateDateTime = (selectedDate: Date, inicio: string, fin: string) => {
    const [horaI, minI] = inicio.split(":").map(Number)
    const [horaF, minF] = fin.split(":").map(Number)

    const fechaInicio = new Date(selectedDate)
    fechaInicio.setHours(horaI, minI, 0, 0)

    const fechaFin = new Date(selectedDate)
    fechaFin.setHours(horaF, minF, 0, 0)

    onDateTimeSelect(fechaInicio, fechaFin)
  }

  // Deshabilitar fechas pasadas y domingos
  const disabledDays = (day: Date) => {
    const hoy = startOfDay(new Date())
    const diaSemana = day.getDay()
    
    // Deshabilitar domingos (0) y fechas pasadas
    return isBefore(startOfDay(day), hoy) || diaSemana === 0
  }

  // Verificar si hay conflicto con reservas existentes
  const tieneConflicto = (): boolean => {
    if (!date) return false

    const [horaI] = horaInicio.split(":").map(Number)
    const [horaF] = horaFin.split(":").map(Number)

    return reservasExistentes.some(reserva => {
      const reservaInicio = new Date(reserva.fechaInicio)
      const reservaFin = new Date(reserva.fechaFin)

      if (!isSameDay(reservaInicio, date)) return false

      const reservaHoraI = reservaInicio.getHours()
      const reservaHoraF = reservaFin.getHours()

      // Verificar solapamiento
      return (
        (horaI >= reservaHoraI && horaI < reservaHoraF) ||
        (horaF > reservaHoraI && horaF <= reservaHoraF) ||
        (horaI <= reservaHoraI && horaF >= reservaHoraF)
      )
    })
  }

  const esHoy = date && isSameDay(date, new Date())
  const conflicto = tieneConflicto()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Seleccionar Fecha y Hora
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información importante */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Horarios de reserva:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Lunes a Viernes: 8:00 AM - 8:00 PM</li>
              <li>• Sábados: 8:00 AM - 12:00 PM</li>
              <li>• Domingos: No disponible</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Calendario */}
        <div>
          <Label className="mb-3 block text-base font-semibold">Fecha de reserva</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            locale={es}
            className="rounded-md border mx-auto"
            fromDate={new Date()}
          />
        </div>

        {/* Selección de horas */}
        {date && (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold text-primary flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
              {esHoy && (
                <p className="text-xs text-muted-foreground mt-1">
                  📍 Hoy - Solo horas futuras disponibles
                </p>
              )}
              {date.getDay() === 6 && (
                <p className="text-xs text-amber-600 mt-1 font-medium">
                  ⏰ Sábado - Horario limitado hasta 12:00 PM
                </p>
              )}
            </div>

            {horasDisponibles.length === 0 ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No hay horas disponibles para hoy. Por favor selecciona otra fecha.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hora-inicio" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora de inicio
                    </Label>
                    <Select value={horaInicio} onValueChange={handleHoraInicioChange}>
                      <SelectTrigger id="hora-inicio">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {horasDisponibles.map((hora) => (
                          <SelectItem key={hora} value={hora}>
                            {hora}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hora-fin" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora de fin
                    </Label>
                    <Select value={horaFin} onValueChange={handleHoraFinChange}>
                      <SelectTrigger id="hora-fin">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {horasDisponibles.map((hora) => (
                          <SelectItem key={hora} value={hora} disabled={hora <= horaInicio}>
                            {hora}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advertencia de conflicto */}
                {conflicto && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      ⚠️ Ya existe una reserva en este horario. Por favor selecciona otro horario.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Duración de la reserva */}
                {!conflicto && (
                  <div className="p-3 bg-muted rounded-md text-sm space-y-1">
                    <div>
                      <span className="font-medium">Duración: </span>
                      <span className="text-muted-foreground">
                        {parseInt(horaFin.split(":")[0]) - parseInt(horaInicio.split(":")[0])} hora(s)
                      </span>
                    </div>
                    <div className="text-xs text-amber-600">
                      ⏱️ Máximo permitido: 3 horas por reserva
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
