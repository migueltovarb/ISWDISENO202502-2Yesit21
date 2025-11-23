package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Auditoria;
import com.example.demo.model.Reserva;
import com.example.demo.model.Usuario;
import com.example.demo.repository.AuditoriaRepository;
import com.example.demo.repository.ReservaRepository;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private AuditoriaRepository auditoriaRepository;
    
    @Autowired
    private NotificacionService notificacionService;

    @Transactional
    public Reserva validarYCrear(Reserva reserva) {
        // Validación de reglas de negocio (RF-10)
        validarReglasNegocio(reserva);

        // Verificación de disponibilidad (RF-09)
        verificarDisponibilidad(reserva);

        // Establecer estado por defecto si no está definido
        if (reserva.getEstado() == null || reserva.getEstado().isEmpty()) {
            reserva.setEstado("CONFIRMADA");
        }

        // Guardar reserva
        Reserva reservaGuardada = reservaRepository.save(reserva);

        // Registrar auditoría
        registrarAuditoria(reserva.getEstudiante(), "CREAR_RESERVA", "RESERVA", reservaGuardada.getId(),
                          "Reserva creada para sala " + reserva.getSala().getNombre());
        
        // Enviar confirmación de reserva
        notificacionService.enviarConfirmacionReserva(reservaGuardada);

        return reservaGuardada;
    }

    private void validarReglasNegocio(Reserva reserva) {
        // Validar que la fecha de inicio sea anterior a la fecha de fin
        if (reserva.getFechaInicio().isAfter(reserva.getFechaFin())) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin");
        }

        // Validar que la reserva no sea en el pasado
        if (reserva.getFechaInicio().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("No se pueden crear reservas en el pasado");
        }

        // Validar duración máxima (ejemplo: 4 horas)
        long horas = java.time.Duration.between(reserva.getFechaInicio(), reserva.getFechaFin()).toHours();
        if (horas > 4) {
            throw new IllegalArgumentException("La duración máxima de reserva es 4 horas");
        }
    }

    private void verificarDisponibilidad(Reserva reserva) {
        List<Reserva> reservasConflictuales = reservaRepository.findConflictual(
            reserva.getSala().getId(),
            reserva.getFechaInicio(),
            reserva.getFechaFin()
        );

        if (!reservasConflictuales.isEmpty()) {
            throw new IllegalArgumentException("La sala no está disponible en el horario solicitado");
        }
    }

    @Transactional
    public Reserva cancelarReserva(String reservaId, String motivo, Usuario usuario) {
        Reserva reserva = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));

        reserva.setEstado("CANCELADA");
        reserva.setMotivoCancelacion(motivo);

        Reserva reservaCancelada = reservaRepository.save(reserva);

        registrarAuditoria(usuario, "CANCELAR_RESERVA", "RESERVA", reservaId,
                          "Reserva cancelada: " + motivo);
        
        // Enviar notificación de cancelación
        notificacionService.enviarNotificacionCancelacion(reservaCancelada);

        return reservaCancelada;
    }

    private void registrarAuditoria(Usuario usuario, String accion, String entidad, String entidadId, String detalles) {
        Auditoria auditoria = new Auditoria(usuario, accion, entidad, entidadId, detalles);
        auditoriaRepository.save(auditoria);
    }

    public List<Reserva> obtenerReservasPorEstudiante(String estudianteId) {
        return reservaRepository.findByEstudianteId(estudianteId);
    }

    public List<Reserva> obtenerReservasPorSala(String salaId) {
        return reservaRepository.findBySalaId(salaId);
    }
    
    public List<Reserva> obtenerTodasLasReservas() {
        return reservaRepository.findAll();
    }
    
    /**
     * Desbloquea/Reactiva una reserva cancelada o completada (solo administrador)
     * Permite al administrador reactivar una reserva que fue bloqueada
     */
    @Transactional
    public Reserva desbloquearReserva(String reservaId, Usuario administrador) {
        // Verificar que el usuario sea administrador
        if (!"ADMINISTRADOR".equals(administrador.getRol())) {
            throw new IllegalArgumentException("Solo los administradores pueden desbloquear reservas");
        }
        
        Reserva reserva = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
        
        // Verificar que la reserva esté cancelada o completada
        if ("ACTIVA".equals(reserva.getEstado())) {
            throw new IllegalArgumentException("La reserva ya está activa");
        }
        
        // Verificar que la reserva no haya pasado (no se puede reactivar una reserva del pasado)
        if (reserva.getFechaFin().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("No se puede desbloquear una reserva que ya pasó");
        }
        
        // Verificar disponibilidad antes de reactivar
        verificarDisponibilidad(reserva);
        
        String estadoAnterior = reserva.getEstado();
        reserva.setEstado("ACTIVA");
        reserva.setMotivoCancelacion(null); // Limpiar motivo de cancelación
        
        Reserva reservaDesbloqueada = reservaRepository.save(reserva);
        
        registrarAuditoria(administrador, "DESBLOQUEAR_RESERVA", "RESERVA", reservaId,
                          "Reserva desbloqueada por administrador. Estado anterior: " + estadoAnterior);
        
        return reservaDesbloqueada;
    }
    
    /**
     * Bloquea/Completa una reserva manualmente (solo administrador)
     * Permite al administrador marcar una reserva como completada antes de tiempo
     */
    @Transactional
    public Reserva bloquearReservaManual(String reservaId, String motivo, Usuario administrador) {
        // Verificar que el usuario sea administrador
        if (!"ADMINISTRADOR".equals(administrador.getRol())) {
            throw new IllegalArgumentException("Solo los administradores pueden bloquear reservas manualmente");
        }
        
        Reserva reserva = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
        
        if (!"ACTIVA".equals(reserva.getEstado())) {
            throw new IllegalArgumentException("Solo se pueden bloquear reservas activas");
        }
        
        reserva.setEstado("COMPLETADA");
        
        Reserva reservaBloqueada = reservaRepository.save(reserva);
        
        registrarAuditoria(administrador, "BLOQUEAR_RESERVA_MANUAL", "RESERVA", reservaId,
                          "Reserva bloqueada manualmente por administrador. Motivo: " + motivo);
        
        return reservaBloqueada;
    }
    
    /**
     * Cambia el estado de una reserva (solo administrador)
     * Método genérico para cambiar el estado de una reserva
     */
    @Transactional
    public Reserva cambiarEstadoReserva(String reservaId, String nuevoEstado, String motivo, Usuario administrador) {
        // Verificar que el usuario sea administrador
        if (!"ADMINISTRADOR".equals(administrador.getRol())) {
            throw new IllegalArgumentException("Solo los administradores pueden cambiar el estado de reservas");
        }
        
        // Validar estado
        if (!List.of("ACTIVA", "CANCELADA", "COMPLETADA").contains(nuevoEstado)) {
            throw new IllegalArgumentException("Estado inválido. Debe ser: ACTIVA, CANCELADA o COMPLETADA");
        }
        
        Reserva reserva = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));
        
        String estadoAnterior = reserva.getEstado();
        reserva.setEstado(nuevoEstado);
        
        if ("CANCELADA".equals(nuevoEstado) && motivo != null) {
            reserva.setMotivoCancelacion(motivo);
        }
        
        Reserva reservaActualizada = reservaRepository.save(reserva);
        
        registrarAuditoria(administrador, "CAMBIAR_ESTADO_RESERVA", "RESERVA", reservaId,
                          String.format("Estado cambiado de %s a %s. Motivo: %s", 
                                      estadoAnterior, nuevoEstado, motivo != null ? motivo : "N/A"));
        
        return reservaActualizada;
    }
}