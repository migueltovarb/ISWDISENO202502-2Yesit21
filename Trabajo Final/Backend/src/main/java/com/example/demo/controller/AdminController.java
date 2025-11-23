package com.example.demo.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Reserva;
import com.example.demo.repository.ReservaRepository;
import com.example.demo.repository.SalaRepository;
import com.example.demo.repository.UsuarioRepository;

/**
 * Controlador REST para operaciones administrativas y estadísticas
 *
 * Este controlador proporciona endpoints para obtener estadísticas del sistema
 * que son utilizadas por el panel de administración del frontend.
 *
 * Endpoints disponibles:
 * - GET /api/admin/stats/usuarios - Total de usuarios
 * - GET /api/admin/stats/salas - Estadísticas de salas
 * - GET /api/admin/stats/reservas-hoy - Reservas del día
 * - GET /api/admin/stats/reservas-pendientes - Reservas futuras pendientes
 * - GET /api/admin/stats/tasa-ocupacion - Tasa de ocupación
 *
 * @author Sistema de Reserva de Salas
 * @version 1.0
 */
@RestController
@RequestMapping("/api/admin/stats")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    /**
     * Obtiene el total de usuarios registrados en el sistema
     *
     * @return ResponseEntity con el total de usuarios
     */
    @GetMapping("/usuarios")
    public ResponseEntity<?> getTotalUsuarios() {
        try {
            long total = usuarioRepository.count();
            return ResponseEntity.ok().body(java.util.Map.of("total", total));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error obteniendo total de usuarios");
        }
    }

    /**
     * Obtiene estadísticas de salas (total y disponibles)
     *
     * @return ResponseEntity con estadísticas de salas
     */
    @GetMapping("/salas")
    public ResponseEntity<?> getSalasStats() {
        try {
            long total = salaRepository.count();
            long disponibles = salaRepository.findByDisponible(true).size();

            return ResponseEntity.ok().body(java.util.Map.of(
                "total", total,
                "disponibles", disponibles
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error obteniendo estadísticas de salas");
        }
    }

    /**
     * Obtiene estadísticas de reservas del día actual
     *
     * @return ResponseEntity con estadísticas de reservas del día
     */
    @GetMapping("/reservas-hoy")
    public ResponseEntity<?> getReservasHoy() {
        try {
            LocalDate hoy = LocalDate.now();
            LocalDateTime inicioDia = hoy.atStartOfDay();
            LocalDateTime finDia = hoy.atTime(23, 59, 59);

            List<Reserva> reservasHoy = reservaRepository.findAll().stream()
                .filter(reserva ->
                    reserva.getFechaInicio().toLocalDate().equals(hoy) ||
                    (reserva.getFechaInicio().isBefore(finDia.toLocalDate().atStartOfDay().plusDays(1)) &&
                     reserva.getFechaFin().isAfter(inicioDia)))
                .toList();

            long total = reservasHoy.size();
            long pendientes = reservasHoy.stream()
                .filter(reserva -> "ACTIVA".equals(reserva.getEstado()) ||
                                  "PENDIENTE".equals(reserva.getEstado()))
                .count();

            return ResponseEntity.ok().body(java.util.Map.of(
                "total", total,
                "pendientes", pendientes
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error obteniendo reservas del día");
        }
    }

    /**
     * Obtiene estadísticas de todas las reservas pendientes (futuras)
     *
     * @return ResponseEntity con estadísticas de reservas pendientes
     */
    @GetMapping("/reservas-pendientes")
    public ResponseEntity<?> getReservasPendientes() {
        try {
            LocalDateTime ahora = LocalDateTime.now();

            List<Reserva> reservasPendientes = reservaRepository.findAll().stream()
                .filter(reserva ->
                    ("CONFIRMADA".equals(reserva.getEstado()) || "PENDIENTE".equals(reserva.getEstado())) &&
                    reserva.getFechaInicio().isAfter(ahora))
                .toList();

            long total = reservasPendientes.size();
            
            // Contar las próximas (en los próximos 7 días)
            LocalDateTime proximaSemana = ahora.plusDays(7);
            long proximas = reservasPendientes.stream()
                .filter(reserva -> reserva.getFechaInicio().isBefore(proximaSemana))
                .count();

            return ResponseEntity.ok().body(java.util.Map.of(
                "total", total,
                "proximas", proximas
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error obteniendo reservas pendientes");
        }
    }

    /**
     * Calcula la tasa de ocupación del sistema
     *
     * @return ResponseEntity con la tasa de ocupación en porcentaje
     */
    @GetMapping("/tasa-ocupacion")
    public ResponseEntity<?> getTasaOcupacion() {
        try {
            long totalSalas = salaRepository.count();
            if (totalSalas == 0) {
                return ResponseEntity.ok().body(java.util.Map.of("tasaOcupacion", 0));
            }

            // Contar reservas activas
            long reservasActivas = reservaRepository.findAll().stream()
                .filter(reserva -> "ACTIVA".equals(reserva.getEstado()) ||
                                  "CONFIRMADA".equals(reserva.getEstado()))
                .count();

            // Calcular porcentaje de ocupación
            double tasaOcupacion = ((double) reservasActivas / totalSalas) * 100;
            int tasaRedondeada = (int) Math.min(100, Math.round(tasaOcupacion));

            return ResponseEntity.ok().body(java.util.Map.of("tasaOcupacion", tasaRedondeada));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error calculando tasa de ocupación");
        }
    }
}