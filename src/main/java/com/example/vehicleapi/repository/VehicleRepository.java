package com.example.vehicleapi.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.vehicleapi.model.Vehicle;

@Repository
public interface VehicleRepository extends MongoRepository<Vehicle, String> {
}