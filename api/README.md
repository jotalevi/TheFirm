# TheFirm API - Stack Completo con Docker

Este proyecto contiene la configuración para ejecutar la aplicación completa (frontend, backend y base de datos) usando Docker.

## Requisitos

- Docker instalado
- Docker Compose instalado

## Estructura del Proyecto

```
TheFirmApi/api/
├── backend/         # API .NET Core
├── frontend/        # Aplicación Next.js
├── docker-compose.yml
├── test-docker.ps1  # Script de prueba para Windows
└── test-docker.sh   # Script de prueba para Linux/Mac
```

## Inicio Rápido

Para iniciar todos los servicios:

```bash
# En la carpeta raíz del proyecto
docker-compose up
```

Para ejecutar en segundo plano:

```bash
docker-compose up -d
```

Para detener todos los servicios:

```bash
docker-compose down
```

## Scripts de Prueba

### Windows (PowerShell)

```powershell
./test-docker.ps1
```

### Linux/Mac

```bash
chmod +x test-docker.sh
./test-docker.sh
```

## Acceso a los Servicios

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5100
- **Base de datos Oracle**:
  - Host: localhost
  - Puerto: 1521
  - SID: FREEPDB1
  - Usuario: system
  - Contraseña: oracle

## Notas Importantes

1. La primera vez que se inicie el proyecto, Oracle puede tardar unos minutos en estar listo.
2. El backend depende de Oracle y el frontend depende del backend, por lo que hay un orden de inicio.
3. Si necesitas reconstruir las imágenes:

```bash
docker-compose build --no-cache
```

4. Para ver los logs de los contenedores:

```bash
# Todos los contenedores
docker-compose logs

# Un contenedor específico
docker-compose logs backend
```

## Solución de Problemas

Si encuentras algún problema:

1. Verifica que los puertos 3000, 5100 y 1521 estén disponibles
2. Comprueba los logs con `docker-compose logs`
3. Intenta reconstruir las imágenes con `docker-compose build --no-cache` 