package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repository.NotificacionRepository;
import com.example.demo.repository.ReservaRepository;
import com.example.demo.service.TareasProgramadasService;

/**
 * Controlador de administración para tareas programadas
 * 
 * Permite a los administradores ejecutar manualmente las tareas programadas
 * y ver estadísticas del sistema de notificaciones
 */
@RestController
@RequestMapping("/api/admin/tareas")
public class AdminTareasController {
    
    @Autowired
    private TareasProgramadasService tareasProgramadasService;
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private NotificacionRepository notificacionRepository;
    
    /**
     * Ejecuta manualmente el envío de recordatorios de 24 horas
     * Solo accesible para administradores
     */
    @PostMapping("/ejecutar/recordatorios-24h")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String, String>> ejecutarRecordatorios24h() {
        tareasProgramadasService.enviarRecordatorios24Horas();
        
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Tarea de recordatorios 24h ejecutada correctamente");
        response.put("estado", "success");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Ejecuta manualmente el envío de recordatorios de 1 hora
     */
    @PostMapping("/ejecutar/recordatorios-1h")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String, String>> ejecutarRecordatorios1h() {
        tareasProgramadasService.enviarRecordatorios1Hora();
        
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Tarea de recordatorios 1h ejecutada correctamente");
        response.put("estado", "success");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Ejecuta manualmente el bloqueo de reservas pasadas
     */
    @PostMapping("/ejecutar/bloquear-reservas")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String, String>> ejecutarBloqueoReservas() {
        tareasProgramadasService.bloquearReservasPasadas();
        
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Tarea de bloqueo de reservas ejecutada correctamente");
        response.put("estado", "success");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Ejecuta manualmente la cancelación de no-shows
     */
    @PostMapping("/ejecutar/cancelar-noshow")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String, String>> ejecutarCancelacionNoShow() {
        tareasProgramadasService.cancelarReservasNoShow();
        
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Tarea de cancelación de no-shows ejecutada correctamente");
        response.put("estado", "success");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Obtiene estadísticas del sistema de notificaciones
     */
    @GetMapping("/estadisticas")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();
        
        // Estadísticas de reservas
        long totalReservas = reservaRepository.count();
        long reservasActivas = reservaRepository.findByEstado("ACTIVA").size();
        long reservasCompletadas = reservaRepository.findByEstado("COMPLETADA").size();
        long reservasCanceladas = reservaRepository.findByEstado("CANCELADA").size();
        
        Map<String, Long> reservasStats = new HashMap<>();
        reservasStats.put("total", totalReservas);
        reservasStats.put("activas", reservasActivas);
        reservasStats.put("completadas", reservasCompletadas);
        reservasStats.put("canceladas", reservasCanceladas);
        
        // Estadísticas de notificaciones
        long totalNotificaciones = notificacionRepository.count();
        long notificacionesEnviadas = notificacionRepository.findByEnviada(true).size();
        long notificacionesPendientes = notificacionRepository.findByEnviada(false).size();
        
        Map<String, Long> notificacionesStats = new HashMap<>();
        notificacionesStats.put("total", totalNotificaciones);
        notificacionesStats.put("enviadas", notificacionesEnviadas);
        notificacionesStats.put("pendientes", notificacionesPendientes);
        
        estadisticas.put("reservas", reservasStats);
        estadisticas.put("notificaciones", notificacionesStats);
        
        return ResponseEntity.ok(estadisticas);
    }
    
    /**
     * Obtiene el estado del sistema de tareas programadas
     */
    @GetMapping("/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String, Object>> obtenerEstadoSistema() {
        Map<String, Object> estado = new HashMap<>();
        
        estado.put("sistema", "activo");
        estado.put("tareasProgramadas", Map.of(
            "recordatorios24h", "Cada hora (0 0 * * * *)",
            "recordatorios1h", "Cada 15 minutos (0 */15 * * * *)",
            "bloqueoReservas", "Cada 30 minutos (0 */30 * * * *)",
            "cancelacionNoShow", "Cada 2 horas (0 0 */2 * * *)",
            "limpiezaDatos", "Diario a las 3 AM (0 0 3 * * *)",
            "reporteEstadisticas", "Diario a las 11 PM (0 0 23 * * *)"
        ));
        
        return ResponseEntity.ok(estado);
    }
}
