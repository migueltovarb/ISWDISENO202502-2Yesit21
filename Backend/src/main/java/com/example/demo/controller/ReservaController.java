package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Reserva;
import com.example.demo.model.Sala;
import com.example.demo.model.Usuario;
import com.example.demo.service.ReservaService;
import com.example.demo.service.SalaService;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private SalaService salaService;

    @GetMapping
    public ResponseEntity<List<Reserva>> obtenerTodasLasReservas() {
        List<Reserva> reservas = reservaService.obtenerTodasLasReservas();
        return ResponseEntity.ok(reservas);
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerReservasPorUsuario(@PathVariable String usuarioId) {
        List<Reserva> reservas = reservaService.obtenerReservasPorEstudiante(usuarioId);
        return ResponseEntity.ok(reservas);
    }
    
    @GetMapping("/sala/{salaId}")
    public ResponseEntity<List<Reserva>> obtenerReservasPorSala(@PathVariable String salaId) {
        List<Reserva> reservas = reservaService.obtenerReservasPorSala(salaId);
        return ResponseEntity.ok(reservas);
    }

    @Autowired
    private com.example.demo.repository.UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva) {
        try {
            // Obtener usuario autenticado del contexto de seguridad JWT
            Usuario estudiante = com.example.demo.util.SecurityUtils.getCurrentUser(usuarioRepository);
            
            if (estudiante == null) {
                return ResponseEntity.status(401).body("Usuario no autenticado");
            }

            // Verificar que la sala existe
            Optional<Sala> sala = salaService.obtenerSalaPorId(reserva.getSala().getId());
            if (sala.isEmpty()) {
                return ResponseEntity.badRequest().body("Sala no encontrada");
            }

            reserva.setEstudiante(estudiante);
            reserva.setSala(sala.get());

            Reserva reservaCreada = reservaService.validarYCrear(reserva);
            return ResponseEntity.ok(reservaCreada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelarReserva(@PathVariable String id, @RequestParam String motivo) {
        try {
            // Obtener usuario autenticado del contexto de seguridad JWT
            Usuario usuario = com.example.demo.util.SecurityUtils.getCurrentUser(usuarioRepository);
            
            if (usuario == null) {
                return ResponseEntity.status(401).body("Usuario no autenticado");
            }

            reservaService.cancelarReserva(id, motivo, usuario);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}