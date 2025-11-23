package com.example.demo.repository;

import com.example.demo.model.Sala;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalaRepository extends MongoRepository<Sala, String> {
    List<Sala> findByDisponible(boolean disponible);
    List<Sala> findByCapacidadGreaterThanEqual(int capacidad);
    List<Sala> findByUbicacion(String ubicacion);
}