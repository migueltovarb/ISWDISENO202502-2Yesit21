#!/bin/bash

# Ejecutar Spring Boot en modo silencioso y filtrar solo el menú
/c/Users/Usuario/Downloads/apache-maven-3.9.11-bin/bin/mvn -q spring-boot:run 2>/dev/null | grep -A 20 "MENÚ DE VEHÍCULOS"
