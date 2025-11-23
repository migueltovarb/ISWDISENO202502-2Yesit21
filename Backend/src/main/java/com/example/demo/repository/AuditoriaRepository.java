package com.example.demo.repository;

import com.example.demo.model.Auditoria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaRepository extends MongoRepository<Auditoria, String> {
    List<Auditoria> findByUsuarioId(String usuarioId);
    List<Auditoria> findByAccion(String accion);
    List<Auditoria> findByEntidad(String entidad);
    List<Auditoria> findByFechaBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
}