package com.example.vehicleapi.model;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class VehicleTest {

    @Test
    public void testDefaultConstructor() {
        Vehicle vehicle = new Vehicle();
        assertNull(vehicle.getPlaca());
        assertNull(vehicle.getMarca());
        assertEquals(0, vehicle.getAnio());
        assertNull(vehicle.getColor());
    }

    @Test
    public void testConstructorWithMarcaAnioColor() {
        Vehicle vehicle = new Vehicle("Toyota", 2020, "Rojo");
        assertNull(vehicle.getPlaca());
        assertEquals("Toyota", vehicle.getMarca());
        assertEquals(2020, vehicle.getAnio());
        assertEquals("Rojo", vehicle.getColor());
    }

    @Test
    public void testConstructorWithAllFields() {
        Vehicle vehicle = new Vehicle("ABC123", "Honda", 2019, "Azul");
        assertEquals("ABC123", vehicle.getPlaca());
        assertEquals("Honda", vehicle.getMarca());
        assertEquals(2019, vehicle.getAnio());
        assertEquals("Azul", vehicle.getColor());
    }

    @Test
    public void testSettersAndGetters() {
        Vehicle vehicle = new Vehicle();
        vehicle.setPlaca("XYZ789");
        vehicle.setMarca("Ford");
        vehicle.setAnio(2021);
        vehicle.setColor("Negro");

        assertEquals("XYZ789", vehicle.getPlaca());
        assertEquals("Ford", vehicle.getMarca());
        assertEquals(2021, vehicle.getAnio());
        assertEquals("Negro", vehicle.getColor());
    }

    @Test
    public void testToString() {
        Vehicle vehicle = new Vehicle("DEF456", "BMW", 2022, "Blanco");
        String expected = "Placa: DEF456 | BMW (2022) - Blanco";
        assertEquals(expected, vehicle.toString());
    }
}