package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Reserva;
import com.example.demo.model.Usuario;
import com.example.demo.service.ReservaService;

/**
 * Controlador REST para gestión administrativa de reservas
 * 
 * Permite a los administradores:
 * - Desbloquear/reactivar reservas canceladas o completadas
 * - Bloquear/completar reservas manualmente
 * - Cambiar el estado de cualquier reserva
 */
@RestController
@RequestMapping("/api/admin/reservas")
public class AdminReservasController {
    
    @Autowired
    private ReservaService reservaService;
    
    /**
     * Desbloquea/Reactiva una reserva cancelada o completada
     * Solo accesible para administradores
     * 
     * @param reservaId ID de la reserva a desbloquear
     * @return Reserva desbloqueada
     */
    @Autowired
    private com.example.demo.repository.UsuarioRepository usuarioRepository;

    @PostMapping("/{reservaId}/desbloquear")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> desbloquearReserva(@PathVariable String reservaId) {
        try {
            // Obtener usuario administrador del contexto de seguridad JWT
            Usuario admin = com.example.demo.util.SecurityUtils.getCurrentUser(usuarioRepository);
            
            if (admin == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            
            Reserva reservaDesbloqueada = reservaService.desbloquearReserva(reservaId, admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Reserva desbloqueada exitosamente");
            response.put("reserva", reservaDesbloqueada);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al desbloquear reserva"));
        }
    }
    
    /**
     * Bloquea/Completa una reserva manualmente
     * Solo accesible para administradores
     * 
     * @param reservaId ID de la reserva a bloquear
     * @param request Objeto con el motivo del bloqueo
     * @return Reserva bloqueada
     */
    @PostMapping("/{reservaId}/bloquear")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> bloquearReserva(
            @PathVariable String reservaId,
            @RequestBody BloquearRequest request) {
        try {
            // Obtener usuario administrador del contexto de seguridad JWT
            Usuario admin = com.example.demo.util.SecurityUtils.getCurrentUser(usuarioRepository);
            
            if (admin == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            
            Reserva reservaBloqueada = reservaService.bloquearReservaManual(
                reservaId, 
                request.getMotivo(), 
                admin
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Reserva bloqueada exitosamente");
            response.put("reserva", reservaBloqueada);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al bloquear reserva"));
        }
    }
    
    /**
     * Corrige todas las reservas sin estado (null)
     * Solo accesible para administradores
     * 
     * @return Número de reservas corregidas
     */
    @Autowired
    private com.example.demo.repository.ReservaRepository reservaRepository;
    
    @PostMapping("/corregir-sin-estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> corregirReservasSinEstado() {
        try {
            // Obtener usuario administrador del contexto de seguridad JWT
            Usuario admin = com.example.demo.util.SecurityUtils.getCurrentUser(usuarioRepository);
            
            if (admin == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            
            // Buscar todas las reservas sin estado
            java.util.List<Reserva> reservasSinEstado = reservaRepository.findAll().stream()
                .filter(r -> r.getEstado() == null || r.getEstado().isEmpty())
                .toList();
            
            int corregidas = 0;
            for (Reserva reserva : reservasSinEstado) {
                // Establecer estado CONFIRMADA para reservas futuras
                if (reserva.getFechaInicio().isAfter(java.time.LocalDateTime.now())) {
                    reserva.setEstado("CONFIRMADA");
                } else if (reserva.getFechaFin().isBefore(java.time.LocalDateTime.now())) {
                    // Establecer COMPLETADA para reservas pasadas
                    reserva.setEstado("COMPLETADA");
                } else {
                    // Establecer ACTIVA para reservas en curso
                    reserva.setEstado("ACTIVA");
                }
                reservaRepository.save(reserva);
                corregidas++;
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Reservas corregidas exitosamente");
            response.put("corregidas", corregidas);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al corregir reservas"));
        }
    }
    
    /**
     * Cambia el estado de una reserva
     * Solo accesible para administradores
     * 
     * @param reservaId ID de la reserva
     * @param request Objeto con el nuevo estado y motivo
     * @return Reserva actualizada
     */
    @PutMapping("/{reservaId}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> cambiarEstadoReserva(
            @PathVariable String reservaId,
            @RequestBody CambiarEstadoRequest request) {
        try {
            // Obtener usuario administrador del contexto de seguridad JWT
            Usuario admin = com.example.demo.util.SecurityUtils.getCurrentUser(usuarioRepository);
            
            if (admin == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            
            Reserva reservaActualizada = reservaService.cambiarEstadoReserva(
                reservaId,
                request.getNuevoEstado(),
                request.getMotivo(),
                admin
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Estado de reserva actualizado exitosamente");
            response.put("reserva", reservaActualizada);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al cambiar estado de reserva"));
        }
    }
    
    // DTOs para las requests
    public static class BloquearRequest {
        private String motivo;
        
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
    }
    
    public static class CambiarEstadoRequest {
        private String nuevoEstado;
        private String motivo;
        
        public String getNuevoEstado() { return nuevoEstado; }
        public void setNuevoEstado(String nuevoEstado) { this.nuevoEstado = nuevoEstado; }
        
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
    }
}
