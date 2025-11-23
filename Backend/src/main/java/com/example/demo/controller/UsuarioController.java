package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;

/**
 * Controlador REST para operaciones de usuarios
 * 
 * Este controlador maneja las operaciones relacionadas con la gestión de usuarios
 * en el sistema de reserva de salas.
 * 
 * Endpoints disponibles:
 * - GET /api/usuarios - Listar todos los usuarios
 * 
 * @author Sistema de Reserva de Salas
 * @version 1.0
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Obtiene la lista de todos los usuarios registrados en el sistema
     * 
     * @return ResponseEntity con la lista de usuarios
     */
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        try {
            List<Usuario> usuarios = usuarioRepository.findAll();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
