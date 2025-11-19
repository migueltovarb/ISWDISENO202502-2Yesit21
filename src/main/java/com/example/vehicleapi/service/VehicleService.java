package com.example.vehicleapi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.vehicleapi.model.Vehicle;
import com.example.vehicleapi.repository.VehicleRepository;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleById(String placa) {
        return vehicleRepository.findById(placa);
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(String placa, Vehicle vehicleDetails) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(placa);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setMarca(vehicleDetails.getMarca());
            vehicle.setAnio(vehicleDetails.getAnio());
            vehicle.setColor(vehicleDetails.getColor());
            return vehicleRepository.save(vehicle);
        }
        return null;
    }

    public void deleteVehicle(String placa) {
        vehicleRepository.deleteById(placa);
    }
}