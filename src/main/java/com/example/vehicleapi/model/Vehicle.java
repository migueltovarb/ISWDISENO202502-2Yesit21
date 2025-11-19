package com.example.vehicleapi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vehicles")
public class Vehicle {
    @Id
    private String placa;
    private String marca;
    private int anio;
    private String color;

    // Constructores
    public Vehicle() {}

    public Vehicle(String marca, int anio, String color) {
        this.marca = marca;
        this.anio = anio;
        this.color = color;
    }

    public Vehicle(String placa, String marca, int anio, String color) {
        this.placa = placa;
        this.marca = marca;
        this.anio = anio;
        this.color = color;
    }

    // Getters y Setters
    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public int getAnio() {
        return anio;
    }

    public void setAnio(int anio) {
        this.anio = anio;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return "Placa: " + placa + " | " + marca + " (" + anio + ") - " + color;
    }
}