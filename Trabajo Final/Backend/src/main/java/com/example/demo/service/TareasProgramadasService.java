package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Reserva;
import com.example.demo.repository.ReservaRepository;

/**
 * Servicio de tareas programadas para el sistema de reservas
 * 
 * Este servicio ejecuta automáticamente tareas periódicas como:
 * - Envío de recordatorios antes de las reservas
 * - Bloqueo/completado de reservas pasadas
 * - Limpieza de datos antiguos
 */
@Service
public class TareasProgramadasService {
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private NotificacionService notificacionService;
    
    /**
     * Envía recordatorios 24 horas antes de las reservas
     * Se ejecuta cada hora
     */
    @Scheduled(cron = "0 0 * * * *") // Cada hora en punto
    @Transactional
    public void enviarRecordatorios24Horas() {
        System.out.println("🔔 Ejecutando tarea: Recordatorios 24 horas");
        
        LocalDateTime ahora = LocalDateTime.now();
        
        // Buscar reservas activas que inicien en aproximadamente 24 horas
        List<Reserva> reservas = reservaRepository.findByEstado("ACTIVA");
        
        int recordatoriosEnviados = 0;
        for (Reserva reserva : reservas) {
            // Verificar si la reserva inicia entre 23 y 25 horas desde ahora
            if (reserva.getFechaInicio().isAfter(ahora.plusHours(23)) && 
                reserva.getFechaInicio().isBefore(ahora.plusHours(25))) {
                
                notificacionService.enviarRecordatorio(reserva, "RECORDATORIO_24H");
                recordatoriosEnviados++;
            }
        }
        
        System.out.println("✅ Recordatorios 24h enviados: " + recordatoriosEnviados);
    }
    
    /**
     * Envía recordatorios 1 hora antes de las reservas
     * Se ejecuta cada 15 minutos
     */
    @Scheduled(cron = "0 */15 * * * *") // Cada 15 minutos
    @Transactional
    public void enviarRecordatorios1Hora() {
        System.out.println("🔔 Ejecutando tarea: Recordatorios 1 hora");
        
        LocalDateTime ahora = LocalDateTime.now();
        
        // Buscar reservas activas que inicien en aproximadamente 1 hora
        List<Reserva> reservas = reservaRepository.findByEstado("ACTIVA");
        
        int recordatoriosEnviados = 0;
        for (Reserva reserva : reservas) {
            // Verificar si la reserva inicia entre 50 minutos y 1 hora 10 minutos desde ahora
            if (reserva.getFechaInicio().isAfter(ahora.plusMinutes(50)) && 
                reserva.getFechaInicio().isBefore(ahora.plusMinutes(70))) {
                
                notificacionService.enviarRecordatorio(reserva, "RECORDATORIO_1H");
                recordatoriosEnviados++;
            }
        }
        
        System.out.println("✅ Recordatorios 1h enviados: " + recordatoriosEnviados);
    }
    
    /**
     * Bloquea/completa automáticamente las reservas que ya pasaron
     * Se ejecuta cada 30 minutos
     */
    @Scheduled(cron = "0 */30 * * * *") // Cada 30 minutos
    @Transactional
    public void bloquearReservasPasadas() {
        System.out.println("🔒 Ejecutando tarea: Bloqueo de reservas pasadas");
        
        LocalDateTime ahora = LocalDateTime.now();
        
        // Buscar reservas activas cuya fecha de fin ya pasó
        List<Reserva> reservas = reservaRepository.findByEstado("ACTIVA");
        
        int reservasBloqueadas = 0;
        for (Reserva reserva : reservas) {
            if (reserva.getFechaFin().isBefore(ahora)) {
                // Marcar como completada
                reserva.setEstado("COMPLETADA");
                reservaRepository.save(reserva);
                reservasBloqueadas++;
                
                System.out.println("   ✓ Reserva completada: " + reserva.getId() + 
                                 " - Sala: " + reserva.getSala().getNombre());
            }
        }
        
        System.out.println("✅ Reservas completadas: " + reservasBloqueadas);
    }
    
    /**
     * Cancela automáticamente reservas que no se usaron (no-show)
     * Se ejecuta cada 2 horas
     */
    @Scheduled(cron = "0 0 */2 * * *") // Cada 2 horas
    @Transactional
    public void cancelarReservasNoShow() {
        System.out.println("⚠️ Ejecutando tarea: Cancelación de no-shows");
        
        LocalDateTime ahora = LocalDateTime.now();
        
        // Buscar reservas activas que deberían haber iniciado hace más de 15 minutos
        List<Reserva> reservas = reservaRepository.findByEstado("ACTIVA");
        
        int reservasCanceladas = 0;
        for (Reserva reserva : reservas) {
            // Si la reserva debería haber iniciado hace más de 15 minutos
            if (reserva.getFechaInicio().isBefore(ahora.minusMinutes(15)) && 
                reserva.getFechaFin().isAfter(ahora)) {
                
                // Cancelar por no-show
                reserva.setEstado("CANCELADA");
                reserva.setMotivoCancelacion("No-show: El usuario no se presentó a la reserva");
                reservaRepository.save(reserva);
                reservasCanceladas++;
                
                System.out.println("   ✓ Reserva cancelada por no-show: " + reserva.getId());
            }
        }
        
        System.out.println("✅ Reservas canceladas por no-show: " + reservasCanceladas);
    }
    
    @Autowired
    private com.example.demo.repository.NotificacionRepository notificacionRepository;

    /**
     * Limpia notificaciones antiguas (más de 30 días)
     * Se ejecuta diariamente a las 3 AM
     */
    @Scheduled(cron = "0 0 3 * * *") // Todos los días a las 3 AM
    @Transactional
    public void limpiarNotificacionesAntiguas() {
        System.out.println("🧹 Ejecutando tarea: Limpieza de notificaciones antiguas");
        
        LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);
        
        // Obtener notificaciones antiguas
        List<com.example.demo.model.Notificacion> notificacionesAntiguas = 
            notificacionRepository.findAll().stream()
                .filter(n -> n.getFechaCreacion().isBefore(hace30Dias))
                .toList();
        
        if (!notificacionesAntiguas.isEmpty()) {
            notificacionRepository.deleteAll(notificacionesAntiguas);
            System.out.println("   ✓ Eliminadas " + notificacionesAntiguas.size() + " notificaciones antiguas");
        }
        
        System.out.println("✅ Limpieza completada");
    }
    
    /**
     * Genera reporte de estadísticas diarias
     * Se ejecuta diariamente a las 23:00
     */
    @Scheduled(cron = "0 0 23 * * *") // Todos los días a las 11 PM
    public void generarReporteEstadisticas() {
        System.out.println("📊 Ejecutando tarea: Reporte de estadísticas diarias");
        
        LocalDateTime hoy = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime manana = hoy.plusDays(1);
        
        List<Reserva> reservasHoy = reservaRepository.findByEstado("ACTIVA");
        long reservasCompletadas = reservasHoy.stream()
            .filter(r -> r.getEstado().equals("COMPLETADA") && 
                        r.getFechaCreacion().isAfter(hoy) && 
                        r.getFechaCreacion().isBefore(manana))
            .count();
        
        System.out.println("📈 Estadísticas del día:");
        System.out.println("   - Reservas completadas: " + reservasCompletadas);
        System.out.println("   - Reservas activas: " + reservasHoy.size());
        
        System.out.println("✅ Reporte generado");
    }
}
