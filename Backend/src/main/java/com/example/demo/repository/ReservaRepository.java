package com.example.demo.repository;

import com.example.demo.model.Reserva;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends MongoRepository<Reserva, String> {
    List<Reserva> findByEstudianteId(String estudianteId);
    List<Reserva> findBySalaId(String salaId);
    List<Reserva> findByEstado(String estado);

    @Query("{ 'sala.$id': ?0, 'estado': 'ACTIVA', $or: [ { $and: [ { 'fechaInicio': { $lte: ?1 } }, { 'fechaFin': { $gt: ?1 } } ] }, { $and: [ { 'fechaInicio': { $lt: ?2 } }, { 'fechaFin': { $gte: ?2 } } ] }, { $and: [ { 'fechaInicio': { $gte: ?1 } }, { 'fechaFin': { $lte: ?2 } } ] } ] }")
    List<Reserva> findConflictual(String salaId, LocalDateTime fechaInicio, LocalDateTime fechaFin);
}