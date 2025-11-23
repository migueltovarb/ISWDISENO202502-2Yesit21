export interface IUsuario {
  id: string
  nombre: string
  apellido?: string
  email: string
  rol: "estudiante" | "administrador" | "ESTUDIANTE" | "ADMINISTRADOR"
  telefono?: string
  carrera?: string
  activo?: boolean
  fechaCreacion?: string
}

export interface ISala {
  id: string
  nombre: string
  descripcion?: string
  capacidad: number
  equipamiento?: string[]
  ubicacion: string
  imagen?: string
  disponible: boolean
  fechaCreacion?: string
}

export interface IReserva {
  id: string
  sala?: ISala
  salaId?: string
  estudiante?: IUsuario
  usuarioId?: string
  fechaInicio: string
  fechaFin: string
  estado: "ACTIVA" | "CANCELADA" | "COMPLETADA" | "pendiente" | "confirmada" | "cancelada"
  motivoCancelacion?: string
  motivo?: string
  fechaCreacion?: string
}

export interface AuthResponse {
  token: string
  usuario: IUsuario
}

export interface Notificacion {
  id: string
  usuario: IUsuario
  reserva: IReserva
  tipo: "RECORDATORIO_24H" | "RECORDATORIO_1H" | "CONFIRMACION" | "CANCELACION"
  mensaje: string
  canal: "EMAIL" | "SMS" | "PUSH"
  enviada: boolean
  fechaEnvio?: string
  fechaCreacion: string
}
