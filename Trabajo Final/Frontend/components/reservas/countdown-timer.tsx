"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  fechaInicio: string
  fechaFin: string
  estado: string
}

export function CountdownTimer({ fechaInicio, fechaFin, estado }: CountdownTimerProps) {
  const [timeInfo, setTimeInfo] = useState<{
    status: "upcoming" | "active" | "finished"
    message: string
    color: string
  }>({
    status: "upcoming",
    message: "",
    color: "text-blue-600",
  })

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()
      const inicio = new Date(fechaInicio)
      const fin = new Date(fechaFin)

      // Si la reserva ya terminó
      if (now > fin) {
        setTimeInfo({
          status: "finished",
          message: "Reserva finalizada",
          color: "text-gray-500",
        })
        return
      }

      // Si la reserva está activa (ya comenzó)
      if (now >= inicio && now <= fin) {
        const diffMs = fin.getTime() - now.getTime()
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

        let color = "text-green-600"
        if (hours === 0 && minutes < 30) {
          color = "text-orange-600"
        }
        if (hours === 0 && minutes < 10) {
          color = "text-red-600"
        }

        setTimeInfo({
          status: "active",
          message: `⏱️ Tiempo restante: ${hours}h ${minutes}m ${seconds}s`,
          color,
        })
        return
      }

      // Si la reserva aún no comienza
      const diffMs = inicio.getTime() - now.getTime()
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      let message = ""
      let color = "text-blue-600"

      if (hours === 0 && minutes < 15) {
        message = `🔔 Comienza en ${minutes} minutos`
        color = "text-amber-600 font-semibold animate-pulse"
      } else if (hours === 0) {
        message = `Comienza en ${minutes} minutos`
        color = "text-blue-600"
      } else if (hours < 24) {
        message = `Comienza en ${hours}h ${minutes}m`
        color = "text-blue-600"
      } else {
        const days = Math.floor(hours / 24)
        message = `Comienza en ${days} día${days > 1 ? "s" : ""}`
        color = "text-gray-600"
      }

      setTimeInfo({
        status: "upcoming",
        message,
        color,
      })
    }

    // Calcular inmediatamente
    calculateTime()

    // Actualizar cada segundo
    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
  }, [fechaInicio, fechaFin])

  if (estado !== "ACTIVA" && estado !== "confirmada") {
    return null
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${timeInfo.color}`}>
      <Clock className="h-4 w-4" />
      <span>{timeInfo.message}</span>
    </div>
  )
}
