# TheFirm Project

## Estructura del Proyecto
- **backend**: API .NET con Entity Framework Core y Oracle
- **frontend**: Aplicación web con Next.js

## Cómo ejecutar
Para ejecutar el proyecto completo, usa Docker Compose:

```bash
docker-compose up -d
```

### URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5100
- Swagger: http://localhost:5100/swagger

## Desarrollo
Para desarrollo local sin Docker:

### Backend
```bash
cd backend
dotnet run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
``` 