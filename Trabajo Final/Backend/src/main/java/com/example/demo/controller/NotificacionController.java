package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Notificacion;
import com.example.demo.repository.NotificacionRepository;

/**
 * Controlador REST para gestionar notificaciones
 * 
 * Permite consultar el historial de notificaciones enviadas a los usuarios
 */
@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {
    
    @Autowired
    private NotificacionRepository notificacionRepository;
    
    /**
     * Obtiene todas las notificaciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesPorUsuario(@PathVariable String usuarioId) {
        List<Notificacion> notificaciones = notificacionRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(notificaciones);
    }
    
    /**
     * Obtiene todas las notificaciones de una reserva
     */
    @GetMapping("/reserva/{reservaId}")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesPorReserva(@PathVariable String reservaId) {
        List<Notificacion> notificaciones = notificacionRepository.findByReservaId(reservaId);
        return ResponseEntity.ok(notificaciones);
    }
    
    /**
     * Obtiene todas las notificaciones pendientes de envío
     */
    @GetMapping("/pendientes")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesPendientes() {
        List<Notificacion> notificaciones = notificacionRepository.findPendientes();
        return ResponseEntity.ok(notificaciones);
    }
}
