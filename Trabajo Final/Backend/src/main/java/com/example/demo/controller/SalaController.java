package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Sala;
import com.example.demo.model.Usuario;
import com.example.demo.service.SalaService;

@RestController
@RequestMapping("/api/salas")
public class SalaController {

    @Autowired
    private SalaService salaService;

    @GetMapping
    public ResponseEntity<List<Sala>> obtenerTodasLasSalas() {
        List<Sala> salas = salaService.obtenerTodasLasSalas();
        return ResponseEntity.ok(salas);
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Sala>> obtenerSalasDisponibles() {
        List<Sala> salas = salaService.obtenerSalasDisponibles();
        return ResponseEntity.ok(salas);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Sala>> buscarSalas(
            @RequestParam(required = false) Integer capacidad,
            @RequestParam(required = false) String ubicacion) {

        List<Sala> salas;
        if (capacidad != null) {
            salas = salaService.buscarSalasPorCapacidad(capacidad);
        } else if (ubicacion != null) {
            salas = salaService.buscarSalasPorUbicacion(ubicacion);
        } else {
            salas = salaService.obtenerTodasLasSalas();
        }

        return ResponseEntity.ok(salas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sala> obtenerSalaPorId(@PathVariable String id) {
        Optional<Sala> sala = salaService.obtenerSalaPorId(id);
        return sala.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Sala> crearSala(@RequestBody Sala sala) {
        try {
            // Usuario administrador dummy para testing
            Usuario admin = new Usuario("admin@test.com", "admin@test.com", "password", "ADMINISTRADOR");
            admin.setId("507f1f77bcf86cd799439012");

            Sala salaCreada = salaService.crearSala(sala, admin);
            return ResponseEntity.ok(salaCreada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sala> actualizarSala(@PathVariable String id, @RequestBody Sala sala) {
        try {
            // Usuario administrador dummy para testing
            Usuario admin = new Usuario("admin@test.com", "admin@test.com", "password", "ADMINISTRADOR");
            admin.setId("507f1f77bcf86cd799439012");

            Sala salaActualizada = salaService.actualizarSala(id, sala, admin);
            return ResponseEntity.ok(salaActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSala(@PathVariable String id) {
        try {
            // Usuario administrador dummy para testing
            Usuario admin = new Usuario("admin@test.com", "admin@test.com", "password", "ADMINISTRADOR");
            admin.setId("507f1f77bcf86cd799439012");

            salaService.eliminarSala(id, admin);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}