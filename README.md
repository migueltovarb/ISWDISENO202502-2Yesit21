# Vehicle CRUD API (Spring Boot + MongoDB)

Proyecto ejemplo que implementa un CRUD de vehículos usando Java + Spring Boot + MongoDB.

## Requisitos
- Java 17+
- Maven 3.6+
- MongoDB corriendo en `mongodb://localhost:27017` (o cambiar URI en `src/main/resources/application.properties`)

## Estructura principal
- `com.example.vehicleapi` - paquete base
  - `controller` - endpoints REST
  - `service` - lógica de negocio
  - `repository` - interfaces con MongoDB
  - `model` - entidades / documentos
  - `exception` - excepciones custom

## Ejecutar localmente
1. Clonar o descargar el proyecto.
2. Configurar MongoDB y la URI en `src/main/resources/application.properties` si es necesario.
3. Construir el proyecto:
   ```
   mvn clean package
   ```
4. Ejecutar:
   ```
   mvn spring-boot:run
   ```
5. Endpoints (base `/api/vehicles`):
   - `POST /api/vehicles` - crear vehículo
   - `GET /api/vehicles` - listar vehículos
   - `GET /api/vehicles/{id}` - obtener vehículo por id
   - `PUT /api/vehicles/{id}` - actualizar
   - `DELETE /api/vehicles/{id}` - eliminar

## Subir a un repositorio
```
git init
git add .
git commit -m "Initial commit - vehicle CRUD API"
# Crear repositorio remoto (GitHub/GitLab) y luego:
git remote add origin <REMOTE_URL>
git push -u origin main
```
