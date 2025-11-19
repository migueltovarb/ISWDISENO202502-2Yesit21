package com.example.vehicleapi;

import java.util.List;
import java.util.Optional;
import java.util.Scanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.vehicleapi.model.Vehicle;
import com.example.vehicleapi.service.VehicleService;

@Component
public class VehicleMenuRunner implements CommandLineRunner {

    @Autowired
    private VehicleService vehicleService;

    @Override
    public void run(String... args) throws Exception {
        try (Scanner scanner = new Scanner(System.in)) {
            boolean running = true;

            while (running) {
                System.out.println("\n=== MENÚ DE VEHÍCULOS ===");
                System.out.println("1. Listar todos los vehículos");
                System.out.println("2. Buscar vehículo por placa");
                System.out.println("3. Crear nuevo vehículo");
                System.out.println("4. Actualizar vehículo");
                System.out.println("5. Eliminar vehículo");
                System.out.println("6. Salir");
                System.out.print("Seleccione una opción: ");

                int opcion = scanner.nextInt();
                scanner.nextLine(); // Consumir el newline

                switch (opcion) {
                    case 1 -> listarVehiculos();
                    case 2 -> buscarVehiculo(scanner);
                    case 3 -> crearVehiculo(scanner);
                    case 4 -> actualizarVehiculo(scanner);
                    case 5 -> eliminarVehiculo(scanner);
                    case 6 -> {
                        running = false;
                        System.out.println("¡Hasta luego!");
                    }
                    default -> System.out.println("Opción no válida. Intente de nuevo.");
                }
            }
        }
    }

    private void listarVehiculos() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        if (vehicles.isEmpty()) {
            System.out.println("No hay vehículos registrados.");
        } else {
            System.out.println("Lista de vehículos:");
            for (Vehicle v : vehicles) {
                System.out.println(v);
            }
        }
    }

    private void buscarVehiculo(Scanner scanner) {
        System.out.print("Ingrese la placa del vehículo: ");
        String id = scanner.nextLine();
        Optional<Vehicle> vehicle = vehicleService.getVehicleById(id);
        if (vehicle.isPresent()) {
            System.out.println("Vehículo encontrado: " + vehicle.get());
        } else {
            System.out.println("Vehículo no encontrado.");
        }
    }

    private void crearVehiculo(Scanner scanner) {
        System.out.print("Placa: ");
        String placa = scanner.nextLine();
        System.out.print("Marca: ");
        String marca = scanner.nextLine();
        System.out.print("Año: ");
        int anio = scanner.nextInt();
        scanner.nextLine(); // Consumir newline
        System.out.print("Color: ");
        String color = scanner.nextLine();

        Vehicle vehicle = new Vehicle(placa, marca, anio, color);
        Vehicle savedVehicle = vehicleService.createVehicle(vehicle);
        System.out.println("Vehículo creado con placa: " + savedVehicle.getPlaca());
        System.out.println("Detalles: " + savedVehicle);
    }

    private void actualizarVehiculo(Scanner scanner) {
        System.out.print("Ingrese el ID del vehículo a actualizar: ");
        String id = scanner.nextLine();
        Optional<Vehicle> optionalVehicle = vehicleService.getVehicleById(id);
        if (optionalVehicle.isPresent()) {
            System.out.println("Vehículo actual: " + optionalVehicle.get());
            System.out.print("Nueva marca: ");
            String marca = scanner.nextLine();
            System.out.print("Nuevo año: ");
            int anio = scanner.nextInt();
            scanner.nextLine(); // Consumir newline
            System.out.print("Nuevo color: ");
            String color = scanner.nextLine();

            Vehicle updatedDetails = new Vehicle(marca, anio, color);
            Vehicle updatedVehicle = vehicleService.updateVehicle(id, updatedDetails);
            if (updatedVehicle != null) {
                System.out.println("Vehículo actualizado: " + updatedVehicle);
            } else {
                System.out.println("Error al actualizar el vehículo.");
            }
        } else {
            System.out.println("Vehículo no encontrado.");
        }
    }

    private void eliminarVehiculo(Scanner scanner) {
        System.out.print("Ingrese la placa del vehículo a eliminar: ");
        String id = scanner.nextLine();
        vehicleService.deleteVehicle(id);
        System.out.println("Vehículo eliminado (si existía).");
    }
}