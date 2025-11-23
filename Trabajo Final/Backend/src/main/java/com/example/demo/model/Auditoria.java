package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "auditoria")
public class Auditoria {
    @Id
    private String id;

    @DBRef
    private Usuario usuario;

    private String accion; // CREAR_RESERVA, CANCELAR_RESERVA, CREAR_SALA, etc.
    private String entidad; // RESERVA, SALA, USUARIO
    private String entidadId;
    private String detalles;
    private LocalDateTime fecha = LocalDateTime.now();

    // Constructor vacío
    public Auditoria() {}

    // Constructor con parámetros
    public Auditoria(Usuario usuario, String accion, String entidad, String entidadId, String detalles) {
        this.usuario = usuario;
        this.accion = accion;
        this.entidad = entidad;
        this.entidadId = entidadId;
        this.detalles = detalles;
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public String getEntidad() { return entidad; }
    public void setEntidad(String entidad) { this.entidad = entidad; }

    public String getEntidadId() { return entidadId; }
    public void setEntidadId(String entidadId) { this.entidadId = entidadId; }

    public String getDetalles() { return detalles; }
    public void setDetalles(String detalles) { this.detalles = detalles; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}