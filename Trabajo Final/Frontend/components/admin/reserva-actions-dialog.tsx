"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adminReservasService } from "@/lib/services/admin-reservas-service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ReservaActionsDialogProps {
  reservaId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ReservaActionsDialog({
  reservaId,
  open,
  onOpenChange,
  onSuccess,
}: ReservaActionsDialogProps) {
  const [action, setAction] = useState<"desbloquear" | "bloquear" | "cambiar">("desbloquear")
  const [motivo, setMotivo] = useState("")
  const [nuevoEstado, setNuevoEstado] = useState<"ACTIVA" | "CANCELADA" | "COMPLETADA">("ACTIVA")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (action === "desbloquear") {
        await adminReservasService.desbloquearReserva(reservaId)
        toast.success("Reserva desbloqueada", {
          description: "La reserva ha sido reactivada exitosamente.",
        })
      } else if (action === "bloquear") {
        if (!motivo) {
          toast.error("Motivo requerido", {
            description: "Debes proporcionar un motivo para bloquear la reserva.",
          })
          setLoading(false)
          return
        }
        await adminReservasService.bloquearReserva(reservaId, motivo)
        toast.success("Reserva bloqueada", {
          description: "La reserva ha sido completada manualmente.",
        })
      } else if (action === "cambiar") {
        await adminReservasService.cambiarEstadoReserva(reservaId, nuevoEstado, motivo)
        toast.success("Estado actualizado", {
          description: `La reserva ahora está en estado: ${nuevoEstado}.`,
        })
      }

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo realizar la acción.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar Reserva</DialogTitle>
          <DialogDescription>Selecciona la acción que deseas realizar sobre esta reserva.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="action">Acción</Label>
            <Select value={action} onValueChange={(v: any) => setAction(v)}>
              <SelectTrigger id="action">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desbloquear">Desbloquear/Reactivar</SelectItem>
                <SelectItem value="bloquear">Bloquear/Completar</SelectItem>
                <SelectItem value="cambiar">Cambiar Estado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {action === "cambiar" && (
            <div className="space-y-2">
              <Label htmlFor="estado">Nuevo Estado</Label>
              <Select value={nuevoEstado} onValueChange={(v: any) => setNuevoEstado(v)}>
                <SelectTrigger id="estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVA">Activa</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                  <SelectItem value="COMPLETADA">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(action === "bloquear" || action === "cambiar") && (
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo {action === "bloquear" ? "(requerido)" : "(opcional)"}</Label>
              <Textarea
                id="motivo"
                placeholder="Describe el motivo de esta acción..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
