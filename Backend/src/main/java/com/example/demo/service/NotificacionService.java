package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Notificacion;
import com.example.demo.model.Reserva;
import com.example.demo.model.Usuario;
import com.example.demo.repository.NotificacionRepository;

/**
 * Servicio para gestionar notificaciones y recordatorios
 * 
 * Este servicio maneja el envío de notificaciones a los usuarios sobre sus reservas.
 * Incluye recordatorios automáticos y confirmaciones.
 */
@Service
public class NotificacionService {
    
    @Autowired
    private NotificacionRepository notificacionRepository;
    
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    
    /**
     * Envía un recordatorio de reserva al usuario
     * 
     * @param reserva La reserva para la cual enviar el recordatorio
     * @param tipo Tipo de recordatorio (RECORDATORIO_24H, RECORDATORIO_1H)
     */
    public void enviarRecordatorio(Reserva reserva, String tipo) {
        // Verificar si ya se envió este tipo de recordatorio
        if (notificacionRepository.findByReservaIdAndTipo(reserva.getId(), tipo).isPresent()) {
            System.out.println("Recordatorio ya enviado para reserva: " + reserva.getId());
            return;
        }
        
        Usuario usuario = reserva.getEstudiante();
        String mensaje = construirMensajeRecordatorio(reserva, tipo);
        
        Notificacion notificacion = new Notificacion(
            usuario,
            reserva,
            tipo,
            mensaje,
            "EMAIL" // Por defecto EMAIL, puede ser SMS o PUSH
        );
        
        // Simular envío de notificación
        boolean enviado = enviarNotificacion(notificacion);
        
        if (enviado) {
            notificacion.setEnviada(true);
            notificacion.setFechaEnvio(LocalDateTime.now());
        }
        
        notificacionRepository.save(notificacion);
        
        System.out.println("✉️ Recordatorio enviado a: " + usuario.getEmail() + " - Tipo: " + tipo);
    }
    
    /**
     * Envía una confirmación de reserva creada
     */
    public void enviarConfirmacionReserva(Reserva reserva) {
        Usuario usuario = reserva.getEstudiante();
        String mensaje = String.format(
            """
            Tu reserva ha sido confirmada.
            
            Sala: %s
            Fecha: %s
            Hora inicio: %s
            Hora fin: %s
            
            Te enviaremos recordatorios antes de tu reserva.""",
            reserva.getSala().getNombre(),
            reserva.getFechaInicio().format(FORMATTER),
            reserva.getFechaInicio().format(DateTimeFormatter.ofPattern("HH:mm")),
            reserva.getFechaFin().format(DateTimeFormatter.ofPattern("HH:mm"))
        );
        
        Notificacion notificacion = new Notificacion(
            usuario,
            reserva,
            "CONFIRMACION",
            mensaje,
            "EMAIL"
        );
        
        boolean enviado = enviarNotificacion(notificacion);
        
        if (enviado) {
            notificacion.setEnviada(true);
            notificacion.setFechaEnvio(LocalDateTime.now());
        }
        
        notificacionRepository.save(notificacion);
    }
    
    /**
     * Envía notificación de cancelación
     */
    public void enviarNotificacionCancelacion(Reserva reserva) {
        Usuario usuario = reserva.getEstudiante();
        String mensaje = String.format(
            """
            Tu reserva ha sido cancelada.
            
            Sala: %s
            Fecha: %s
            Motivo: %s""",
            reserva.getSala().getNombre(),
            reserva.getFechaInicio().format(FORMATTER),
            reserva.getMotivoCancelacion() != null ? reserva.getMotivoCancelacion() : "No especificado"
        );
        
        Notificacion notificacion = new Notificacion(
            usuario,
            reserva,
            "CANCELACION",
            mensaje,
            "EMAIL"
        );
        
        boolean enviado = enviarNotificacion(notificacion);
        
        if (enviado) {
            notificacion.setEnviada(true);
            notificacion.setFechaEnvio(LocalDateTime.now());
        }
        
        notificacionRepository.save(notificacion);
    }
    
    /**
     * Construye el mensaje del recordatorio según el tipo
     */
    private String construirMensajeRecordatorio(Reserva reserva, String tipo) {
        String tiempoAntes = tipo.equals("RECORDATORIO_24H") ? "24 horas" : "1 hora";
        
        return String.format(
            """
            Recordatorio: Tu reserva es en %s
            
            Sala: %s
            Ubicación: %s
            Fecha y hora: %s
            Duración: hasta %s
            
            ¡No olvides asistir!""",
            tiempoAntes,
            reserva.getSala().getNombre(),
            reserva.getSala().getUbicacion(),
            reserva.getFechaInicio().format(FORMATTER),
            reserva.getFechaFin().format(DateTimeFormatter.ofPattern("HH:mm"))
        );
    }
    
    /**
     * Registra la notificación en la base de datos sin enviarla
     * Las notificaciones quedan registradas para consulta posterior
     */
    private boolean enviarNotificacion(Notificacion notificacion) {
        // Solo registrar en base de datos, no enviar
        System.out.println("📝 Notificación registrada: " + notificacion.getTipo() + " para " + notificacion.getUsuario().getEmail());
        return true;
    }
}
