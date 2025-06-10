# Script para iniciar TheFirm con Docker Compose
Write-Host "Iniciando TheFirm..." -ForegroundColor Cyan

# Verificar si Docker está en ejecución
try {
    docker info | Out-Null
}
catch {
    Write-Host "Error: Docker no está en ejecución. Por favor, inicia Docker y vuelve a ejecutar este script." -ForegroundColor Red
    exit 1
}

# Ejecutar docker-compose
Write-Host "Construyendo y levantando contenedores..." -ForegroundColor Yellow
cd TheFirmApi
docker-compose up -d --build

# Verificar si los contenedores están en ejecución
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nAplicación iniciada correctamente!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Backend API: http://localhost:5100" -ForegroundColor Cyan
    Write-Host "Swagger: http://localhost:5100/swagger" -ForegroundColor Cyan
    Write-Host "`nPara detener la aplicación ejecuta: docker-compose down" -ForegroundColor Yellow
} else {
    Write-Host "Error al iniciar la aplicación. Revisa los logs con: docker-compose logs" -ForegroundColor Red
} 