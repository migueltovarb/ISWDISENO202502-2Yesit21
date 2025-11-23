package com.example.demo.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Modelo de entidad Notificación para el sistema de recordatorios
 * 
 * Almacena las notificaciones enviadas a los usuarios sobre sus reservas.
 * Permite rastrear qué recordatorios se han enviado y cuándo.
 */
@Document(collection = "notificaciones")
public class Notificacion {
    @Id
    private String id;
    
    @DBRef
    private Usuario usuario;
    
    @DBRef
    private Reserva reserva;
    
    private String tipo; // RECORDATORIO_24H, RECORDATORIO_1H, CONFIRMACION, CANCELACION
    private String mensaje;
    private String canal; // EMAIL, SMS, PUSH
    private boolean enviada = false;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    // Constructores
    public Notificacion() {}
    
    public Notificacion(Usuario usuario, Reserva reserva, String tipo, String mensaje, String canal) {
        this.usuario = usuario;
        this.reserva = reserva;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.canal = canal;
    }
    
    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public Reserva getReserva() { return reserva; }
    public void setReserva(Reserva reserva) { this.reserva = reserva; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    
    public String getCanal() { return canal; }
    public void setCanal(String canal) { this.canal = canal; }
    
    public boolean isEnviada() { return enviada; }
    public void setEnviada(boolean enviada) { this.enviada = enviada; }
    
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
