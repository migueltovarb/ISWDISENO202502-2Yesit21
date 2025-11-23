"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ISala } from "@/lib/types"
import Image from "next/image"

interface SalaCardProps {
  sala: ISala
  onViewDetails: (salaId: string) => void
  onReserve?: (salaId: string) => void
}

export function SalaCard({ sala, onViewDetails, onReserve }: SalaCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-muted">
        <Image src={sala.imagen || "/placeholder.svg"} alt={sala.nombre} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant={sala.disponible ? "default" : "secondary"}>
            {sala.disponible ? "Disponible" : "Ocupada"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{sala.nombre}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <span>{sala.ubicacion}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">Capacidad: {sala.capacidad} personas</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {sala.equipamiento && sala.equipamiento.length > 0 ? (
            <>
              {sala.equipamiento.slice(0, 3).map((equip, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {equip}
                </Badge>
              ))}
              {sala.equipamiento.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{sala.equipamiento.length - 3} más
                </Badge>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Sin equipamiento</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onViewDetails(sala.id)}>
          Ver Detalles
        </Button>
        {onReserve && sala.disponible && (
          <Button className="flex-1" onClick={() => onReserve(sala.id)}>
            Reservar
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
