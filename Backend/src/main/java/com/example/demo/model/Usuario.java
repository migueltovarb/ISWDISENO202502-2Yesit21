/**
 * Modelo de entidad Usuario para el sistema de reserva de salas
 *
 * Esta clase representa a un usuario del sistema, ya sea estudiante o administrador.
 * Se mapea a la colección "usuarios" en MongoDB y contiene toda la información
 * necesaria para la autenticación y gestión de usuarios.
 *
 * Campos principales:
 * - id: Identificador único generado por MongoDB
 * - nombre: Nombre del usuario
 * - email: Email único para autenticación
 * - password: Contraseña encriptada
 * - rol: Rol del usuario (ESTUDIANTE o ADMINISTRADOR)
 * - telefono/carrera: Campos opcionales según el rol
 * - activo: Estado del usuario
 * - fechaCreacion: Timestamp de creación
 *
 * @author Sistema de Reserva de Salas
 * @version 1.0
 */
package com.example.demo.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios")
public class Usuario {
    @Id
    private String id;
    private String nombre;
    private String email;
    private String password;
    private String rol; // ADMINISTRADOR o ESTUDIANTE
    private String telefono;
    private String carrera;
    private boolean activo = true;
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // Constructor vacío
    public Usuario() {}

    // Constructor con parámetros
    public Usuario(String nombre, String email, String password, String rol) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getCarrera() { return carrera; }
    public void setCarrera(String carrera) { this.carrera = carrera; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}