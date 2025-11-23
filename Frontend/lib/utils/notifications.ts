import { toast } from "sonner"

export const notifications = {
  reservaCreada: (sala: string, fecha: string) => {
    toast.success("¡Reserva Confirmada!", {
      description: `Tu reserva para ${sala} el ${fecha} ha sido confirmada exitosamente.`,
      duration: 5000,
    })
  },

  reservaCancelada: (sala: string) => {
    toast.info("Reserva Cancelada", {
      description: `Tu reserva para ${sala} ha sido cancelada.`,
      duration: 4000,
    })
  },

  recordatorio24h: (sala: string, fecha: string) => {
    toast("Recordatorio: Reserva en 24 horas", {
      description: `Tu reserva para ${sala} es mañana a las ${fecha}.`,
      duration: 6000,
    })
  },

  recordatorio1h: (sala: string, fecha: string) => {
    toast.warning("¡Recordatorio Urgente!", {
      description: `Tu reserva para ${sala} es en 1 hora (${fecha}).`,
      duration: 8000,
    })
  },

  error: (mensaje: string) => {
    toast.error("Error", {
      description: mensaje,
      duration: 4000,
    })
  },

  success: (titulo: string, mensaje: string) => {
    toast.success(titulo, {
      description: mensaje,
      duration: 4000,
    })
  },

  info: (titulo: string, mensaje: string) => {
    toast.info(titulo, {
      description: mensaje,
      duration: 4000,
    })
  },
}
