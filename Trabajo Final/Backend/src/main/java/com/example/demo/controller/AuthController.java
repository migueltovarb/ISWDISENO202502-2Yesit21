/**
 * Controlador REST para operaciones de autenticación y registro de usuarios
 *
 * Este controlador maneja todas las operaciones relacionadas con la autenticación
 * de usuarios en el sistema de reserva de salas. Utiliza JWT (JSON Web Tokens)
 * para la gestión de sesiones y Spring Security para la autenticación.
 *
 * Endpoints disponibles:
 * - POST /api/auth/login - Iniciar sesión
 * - POST /api/auth/register - Registrar nuevo usuario
 *
 * @author Sistema de Reserva de Salas
 * @version 1.0
 */
package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.security.JwtTokenProvider;

/**
 * Controlador para operaciones de autenticación y registro.
 * Maneja login y registro de usuarios con JWT.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Endpoint para iniciar sesión de usuarios
     *
     * Este método autentica a un usuario validando sus credenciales contra la base de datos.
     * Si las credenciales son correctas, genera un token JWT y lo retorna junto con los
     * datos del usuario.
     *
     * @param loginRequest Objeto con email y password del usuario
     * @return ResponseEntity con token JWT y datos del usuario, o error si falla autenticación
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail()).orElse(null);

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("usuario", usuario);

            return ResponseEntity.ok(response);
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error en el servidor");
        }
    }

    /**
     * Endpoint para registrar un nuevo usuario en el sistema
     *
     * Este método crea una nueva cuenta de usuario en el sistema. Valida que el email
     * no esté registrado previamente, encripta la contraseña y genera un token JWT
     * para la sesión inmediata del usuario.
     *
     * @param registerRequest Objeto con datos del nuevo usuario (nombre, email, password, etc.)
     * @return ResponseEntity con token JWT y datos del usuario creado, o error si falla registro
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            if (usuarioRepository.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.status(400).body("El email ya está registrado");
            }

            Usuario usuario = new Usuario();
            usuario.setNombre(registerRequest.getNombre());
            usuario.setEmail(registerRequest.getEmail());
            usuario.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            usuario.setRol(registerRequest.getRol() != null ? registerRequest.getRol() : "ESTUDIANTE");
            usuario.setTelefono(registerRequest.getTelefono());
            usuario.setCarrera(registerRequest.getCarrera());

            usuarioRepository.save(usuario);

            // Generar token para el nuevo usuario
            String jwt = tokenProvider.generateTokenFromUsername(
                usuario.getEmail(),
                usuario.getRol()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("usuario", usuario);

            return ResponseEntity.ok(response);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(400).body("El email ya está registrado");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al registrar usuario: " + e.getMessage());
        }
    }

    // DTOs para las requests
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String nombre;
        private String email;
        private String password;
        private String telefono;
        private String carrera;
        private String rol;

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
        public String getCarrera() { return carrera; }
        public void setCarrera(String carrera) { this.carrera = carrera; }
        public String getRol() { return rol; }
        public void setRol(String rol) { this.rol = rol; }
    }
}