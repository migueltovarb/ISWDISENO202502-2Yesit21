# 📚 Sistema de Reserva de Salas de Estudio

Sistema web full-stack para la gestión de reservas de salas de estudio universitarias, desarrollado con Next.js, Spring Boot y MongoDB Atlas.

## 🎯 Características Principales

### 👨‍🎓 Para Estudiantes
- ✅ Visualización de salas disponibles con imágenes
- ✅ Sistema de reservas con calendario inteligente (Lunes-Sábado)
- ✅ Gestión de reservas personales
- ✅ Cancelación de reservas
- ✅ Contador de tiempo restante en reservas activas
- ✅ Perfil de usuario

### 👨‍💼 Para Administradores
- ✅ Dashboard con estadísticas en tiempo real
- ✅ CRUD completo de salas
- ✅ Carga de imágenes para salas
- ✅ Gestión de usuarios registrados
- ✅ Gestión de todas las reservas
- ✅ Cambio de estados de reservas
- ✅ Métricas de ocupación

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│                   Puerto: 3000                           │
│  - React 19 + TypeScript                                │
│  - Tailwind CSS + shadcn/ui                             │
│  - Axios para HTTP                                       │
└────────────────────┬────────────────────────────────────┘
                     │ REST API (JSON)
┌────────────────────▼────────────────────────────────────┐
│              BACKEND (Spring Boot)                       │
│                   Puerto: 8080                           │
│  - Java 21                                               │
│  - Spring Security + JWT                                 │
│  - Validaciones de negocio                               │
└────────────────────┬────────────────────────────────────┘
                     │ MongoDB Driver
┌────────────────────▼────────────────────────────────────┐
│           BASE DE DATOS (MongoDB Atlas)                  │
│  - Colecciones: usuarios, salas, reservas               │
│  - Replicación automática                               │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js** 14.2.25 - Framework React con SSR
- **React** 19 - Librería UI
- **TypeScript** 5 - Tipado estático
- **Tailwind CSS** 4.1.9 - Estilos utility-first
- **shadcn/ui** - Componentes accesibles
- **Axios** - Cliente HTTP
- **Sonner** - Sistema de notificaciones

### Backend
- **Spring Boot** 3.5.7 - Framework Java
- **Java** 21 - Lenguaje de programación
- **Spring Data MongoDB** - ORM para MongoDB
- **Spring Security** - Autenticación y autorización
- **JWT** (jjwt 0.11.5) - Tokens de autenticación
- **Maven** - Gestor de dependencias

### Base de Datos
- **MongoDB Atlas** - Base de datos en la nube
- **Cluster** en AWS US-EAST-1
- **Replicación** de 3 nodos

## 📋 Requisitos Previos

- **Node.js** 18 o superior
- **Java** 21
- **Maven** 3.x
- **Git**
- Conexión a internet (para MongoDB Atlas)

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd "Trabajo Final Diseño"
```

### 2. Configurar Backend

```bash
cd Backend
./mvnw spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 3. Configurar Frontend

```bash
cd Frontend
npm install --legacy-peer-deps
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
Trabajo Final Diseño/
├── Frontend/                 # Aplicación Next.js
│   ├── app/                 # Páginas (App Router)
│   ├── components/          # Componentes React
│   ├── lib/                 # Servicios y utilidades
│   └── public/              # Archivos estáticos
│
├── Backend/                  # API Spring Boot
│   ├── src/main/java/       # Código fuente
│   │   ├── controller/      # Endpoints REST
│   │   ├── service/         # Lógica de negocio
│   │   ├── model/           # Entidades MongoDB
│   │   ├── repository/      # Acceso a datos
│   │   └── security/        # Configuración JWT
│   └── src/main/resources/  # Configuración
│
└── README.md                 # Este archivo
```

## 🔐 Seguridad

- **Autenticación JWT** con tokens de 24 horas
- **Bcrypt** para hash de contraseñas
- **Roles de usuario** (ESTUDIANTE, ADMINISTRADOR)
- **Protección de rutas** por rol
- **CORS** configurado
- **Validación de entrada** en backend

## 📊 Funcionalidades Destacadas

### Sistema de Reservas
- Calendario con restricciones (Lunes-Sábado, Sábado hasta 12:00)
- Validación de disponibilidad en tiempo real
- Duración máxima de 4 horas por reserva
- Prevención de conflictos de horarios

### Gestión de Salas
- CRUD completo con imágenes
- Información de capacidad y equipamiento
- Estados de disponibilidad
- Búsqueda y filtrado

### Sistema de Notificaciones
- Confirmación de reservas
- Recordatorios automáticos (24h y 1h antes)
- Notificaciones de cancelación
- Sistema de auditoría

## 🎨 Diseño

- **Responsive Design** - Funciona en móvil, tablet y desktop
- **Tema claro/oscuro** - Cambio automático según preferencias
- **Accesibilidad** - Componentes accesibles con ARIA
- **UX optimizada** - Navegación intuitiva y rápida

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Restablecer contraseña

### Salas
- `GET /api/salas` - Listar todas las salas
- `GET /api/salas/{id}` - Obtener sala por ID
- `POST /api/salas` - Crear sala (admin)
- `PUT /api/salas/{id}` - Actualizar sala (admin)
- `DELETE /api/salas/{id}` - Eliminar sala (admin)

### Reservas
- `GET /api/reservas` - Listar todas las reservas
- `GET /api/reservas/usuario/{id}` - Reservas por usuario
- `POST /api/reservas` - Crear reserva
- `DELETE /api/reservas/{id}` - Cancelar reserva

### Administración
- `GET /api/admin/stats/usuarios` - Total de usuarios
- `GET /api/admin/stats/salas` - Estadísticas de salas
- `GET /api/admin/stats/reservas-pendientes` - Reservas futuras
- `GET /api/admin/stats/tasa-ocupacion` - Porcentaje de ocupación

## 🧪 Testing

```bash
# Frontend
cd Frontend
npm test

# Backend
cd Backend
./mvnw test
```

## 📦 Build para Producción

### Frontend
```bash
cd Frontend
npm run build
npm start
```

### Backend
```bash
cd Backend
./mvnw clean package
java -jar target/demo-0.0.1-SNAPSHOT.war
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

## 👥 Autores

- **Desarrollador Principal** - Sistema de Reserva de Salas

## 📞 Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**
