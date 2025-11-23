package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;

/**
 * Controlador para recuperación de contraseña
 */
@RestController
@RequestMapping("/api/auth")
public class PasswordRecoveryController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Almacenamiento temporal de tokens (en producción usar Redis o base de datos)
    private final Map<String, TokenInfo> tokens = new HashMap<>();

    static class TokenInfo {
        String email;
        LocalDateTime expiry;

        TokenInfo(String email, LocalDateTime expiry) {
            this.email = email;
            this.expiry = expiry;
        }
    }

    /**
     * Solicitar recuperación de contraseña
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email es requerido");
        }

        // Verificar si el usuario existe
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        
        if (usuario == null) {
            // Por seguridad, no revelar si el email existe o no
            return ResponseEntity.ok().body(Map.of(
                "message", "Si el email existe, recibirás un enlace de recuperación",
                "token", "" // En producción, enviar por email
            ));
        }

        // Generar token
        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenInfo(email, LocalDateTime.now().plusHours(1)));

        // En producción: Enviar email con el token
        System.out.println("🔑 Token de recuperación generado para " + email + ": " + token);
        System.out.println("   Expira en: 1 hora");

        return ResponseEntity.ok().body(Map.of(
            "message", "Si el email existe, recibirás un enlace de recuperación",
            "token", token, // Solo para desarrollo, en producción enviar por email
            "email", email
        ));
    }

    /**
     * Verificar token de recuperación
     */
    @PostMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");

        if (token == null || !tokens.containsKey(token)) {
            return ResponseEntity.badRequest().body("Token inválido o expirado");
        }

        TokenInfo info = tokens.get(token);
        if (LocalDateTime.now().isAfter(info.expiry)) {
            tokens.remove(token);
            return ResponseEntity.badRequest().body("Token expirado");
        }

        return ResponseEntity.ok().body(Map.of(
            "valid", true,
            "email", info.email
        ));
    }

    /**
     * Restablecer contraseña
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token y nueva contraseña son requeridos");
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("La contraseña debe tener al menos 6 caracteres");
        }

        // Verificar token
        if (!tokens.containsKey(token)) {
            return ResponseEntity.badRequest().body("Token inválido o expirado");
        }

        TokenInfo info = tokens.get(token);
        if (LocalDateTime.now().isAfter(info.expiry)) {
            tokens.remove(token);
            return ResponseEntity.badRequest().body("Token expirado");
        }

        // Actualizar contraseña
        Usuario usuario = usuarioRepository.findByEmail(info.email).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);

        // Eliminar token usado
        tokens.remove(token);

        System.out.println("✅ Contraseña actualizada para: " + info.email);

        return ResponseEntity.ok().body(Map.of(
            "message", "Contraseña actualizada exitosamente"
        ));
    }
}
