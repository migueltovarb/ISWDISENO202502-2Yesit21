package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Notificacion;

@Repository
public interface NotificacionRepository extends MongoRepository<Notificacion, String> {
    
    List<Notificacion> findByUsuarioId(String usuarioId);
    
    List<Notificacion> findByReservaId(String reservaId);
    
    List<Notificacion> findByEnviada(boolean enviada);
    
    /**
     * Verifica si ya existe una notificación de un tipo específico para una reserva
     * Evita enviar recordatorios duplicados
     */
    @Query("{ 'reserva.$id': ?0, 'tipo': ?1 }")
    Optional<Notificacion> findByReservaIdAndTipo(String reservaId, String tipo);
    
    /**
     * Encuentra notificaciones pendientes de envío
     */
    @Query("{ 'enviada': false }")
    List<Notificacion> findPendientes();
}
