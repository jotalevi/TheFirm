#!/usr/bin/env pwsh

Write-Host "Probando configuración de Docker para TheFirm API..." -ForegroundColor Cyan

# Verificar que Docker está instalado
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker instalado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está instalado o no está disponible en PATH" -ForegroundColor Red
    exit 1
}

# Verificar que docker-compose está instalado
try {
    $dockerComposeVersion = docker-compose --version
    Write-Host "✅ Docker Compose instalado: $dockerComposeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose no está instalado o no está disponible en PATH" -ForegroundColor Red
    exit 1
}

# Construir y levantar los contenedores
Write-Host "🔨 Construyendo y levantando contenedores..." -ForegroundColor Cyan
docker-compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir los contenedores" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Iniciando contenedores..." -ForegroundColor Cyan
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al iniciar los contenedores" -ForegroundColor Red
    exit 1
}

# Esperar a que los servicios estén disponibles
Write-Host "⏳ Esperando a que los servicios estén disponibles..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Verificar que los contenedores están corriendo
$containers = @("oracle-xe", "thefirm-api", "thefirm-admin")
foreach ($container in $containers) {
    $status = docker ps --filter "name=$container" --format "{{.Status}}"
    if ($status -like "Up*") {
        Write-Host "✅ Contenedor $container está corriendo" -ForegroundColor Green
    } else {
        Write-Host "❌ Contenedor $container no está corriendo" -ForegroundColor Red
    }
}

Write-Host "`n📋 Información de servicios:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:5100" -ForegroundColor Yellow
Write-Host "Base de datos Oracle: localhost:1521/FREEPDB1" -ForegroundColor Yellow
Write-Host "Usuario BD: system" -ForegroundColor Yellow
Write-Host "Contraseña BD: oracle" -ForegroundColor Yellow

Write-Host "`n🛑 Para detener los servicios, ejecuta: docker-compose down" -ForegroundColor Magenta 