# Script para probar endpoints de eventos con autenticación
$baseUrl = "http://localhost:5100"

Write-Host "=== Pruebas de Endpoints de Eventos ===" -ForegroundColor Green

# 1. Login para obtener token
Write-Host "`n1. Obteniendo token de autenticación..." -ForegroundColor Yellow
$loginData = @{
    run = "123456789"
    passwordHash = "Contrasena123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login exitoso - Token obtenido" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Headers con autenticación
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Obtener todos los eventos (endpoint público)
Write-Host "`n2. Probando GET /events (público)..." -ForegroundColor Yellow
try {
    $publicEvents = Invoke-RestMethod -Uri "$baseUrl/events" -Method GET
    Write-Host "✅ Eventos públicos obtenidos: $($publicEvents.Count) eventos" -ForegroundColor Green
    $publicEvents | ForEach-Object { Write-Host "  - $($_.eventName) (Público: $($_.public))" }
} catch {
    Write-Host "❌ Error obteniendo eventos públicos: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Obtener todos los eventos (endpoint privado para admin)
Write-Host "`n3. Probando GET /events/all (admin)..." -ForegroundColor Yellow
try {
    $allEvents = Invoke-RestMethod -Uri "$baseUrl/events/all" -Method GET -Headers $headers
    Write-Host "✅ Todos los eventos obtenidos: $($allEvents.Count) eventos" -ForegroundColor Green
    $allEvents | ForEach-Object { Write-Host "  - $($_.eventName) (Público: $($_.public), Empresa: $($_.companyName))" }
} catch {
    Write-Host "❌ Error obteniendo todos los eventos: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Obtener empresas para crear evento
Write-Host "`n4. Obteniendo empresas..." -ForegroundColor Yellow
try {
    $companies = Invoke-RestMethod -Uri "$baseUrl/companies" -Method GET -Headers $headers
    Write-Host "✅ Empresas obtenidas: $($companies.items.Count) empresas" -ForegroundColor Green
    $firstCompany = $companies.items[0]
    Write-Host "  Usando empresa: $($firstCompany.companyName) (ID: $($firstCompany.id))" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error obteniendo empresas: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. Crear un nuevo evento
Write-Host "`n5. Creando nuevo evento..." -ForegroundColor Yellow
$newEvent = @{
    slug = "test-event-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    eventName = "Evento de Prueba"
    eventDescription = "Este es un evento de prueba creado desde el script"
    startDate = "2024-12-25T09:00:00"
    endDate = "2024-12-25T18:00:00"
    logoIrid = "test-logo"
    bannerIrid = "test-banner"
    templateIrid = "test-template"
    cssIrid = "test-css"
    public = $true
    companyId = $firstCompany.id
} | ConvertTo-Json

try {
    $createdEvent = Invoke-RestMethod -Uri "$baseUrl/events" -Method POST -Body $newEvent -Headers $headers
    Write-Host "✅ Evento creado exitosamente: $($createdEvent.eventName)" -ForegroundColor Green
    Write-Host "  Slug: $($createdEvent.slug)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error creando evento: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 6. Obtener el evento específico
Write-Host "`n6. Obteniendo evento específico..." -ForegroundColor Yellow
try {
    $specificEvent = Invoke-RestMethod -Uri "$baseUrl/events/$($createdEvent.slug)" -Method GET
    Write-Host "✅ Evento específico obtenido: $($specificEvent.eventName)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo evento específico: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Actualizar el evento
Write-Host "`n7. Actualizando evento..." -ForegroundColor Yellow
$updateEvent = @{
    eventName = "Evento de Prueba Actualizado"
    eventDescription = "Este evento ha sido actualizado desde el script"
    startDate = "2024-12-26T09:00:00"
    endDate = "2024-12-26T18:00:00"
    logoIrid = "updated-logo"
    bannerIrid = "updated-banner"
    templateIrid = "updated-template"
    cssIrid = "updated-css"
    public = $false
} | ConvertTo-Json

try {
    $updatedEvent = Invoke-RestMethod -Uri "$baseUrl/events/$($createdEvent.slug)" -Method PUT -Body $updateEvent -Headers $headers
    Write-Host "✅ Evento actualizado exitosamente: $($updatedEvent.eventName)" -ForegroundColor Green
    Write-Host "  Público: $($updatedEvent.public)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error actualizando evento: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Eliminar el evento
Write-Host "`n8. Eliminando evento..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/events/$($createdEvent.slug)" -Method DELETE -Headers $headers
    Write-Host "✅ Evento eliminado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error eliminando evento: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Pruebas completadas ===" -ForegroundColor Green 