# Script para probar endpoints de empresas con autenticación
$baseUrl = "http://localhost:5100"

Write-Host "=== Pruebas de Endpoints de Empresas ===" -ForegroundColor Green

# 1. Login para obtener token
Write-Host "`n1. Obteniendo token de autenticación..." -ForegroundColor Yellow
$loginData = @{
    run = "11111111-1"
    passwordHash = "password!"
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

# 2. Obtener todas las empresas
Write-Host "`n2. Probando GET /companies..." -ForegroundColor Yellow
try {
    $companies = Invoke-RestMethod -Uri "$baseUrl/companies" -Method GET -Headers $headers
    Write-Host "✅ Empresas obtenidas: $($companies.Count) empresas" -ForegroundColor Green
    $companies | ForEach-Object { Write-Host "  - $($_.companyName) (RUN: $($_.companyRun))" }
} catch {
    Write-Host "❌ Error obteniendo empresas: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Crear una nueva empresa
Write-Host "`n3. Creando nueva empresa..." -ForegroundColor Yellow
$newCompany = @{
    companyName = "Empresa de Prueba $(Get-Date -Format 'yyyyMMdd-HHmmss')"
    companyRun = "76.543.210-K"
    logoIrid = "test-logo"
    bannerIrid = "test-banner"
    htmlIrid = "test-html"
    contactRut = "12.345.678-9"
    contactName = "Juan"
    contactSurname = "Pérez"
    contactEmail = "juan.perez@empresa.com"
    contactPhone = "+56 9 1234 5678"
    contactDirStates = 1
    contactDirCounty = 1
    contactDirStreet1 = "Calle Principal"
    contactDirStreet2 = "Sector Centro"
    contactDirStNumber = "123"
    contactDirInNumber = "A"
} | ConvertTo-Json

try {
    $createdCompany = Invoke-RestMethod -Uri "$baseUrl/companies" -Method POST -Body $newCompany -Headers $headers
    Write-Host "✅ Empresa creada exitosamente: $($createdCompany.companyName)" -ForegroundColor Green
    Write-Host "  ID: $($createdCompany.id)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error creando empresa: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Obtener la empresa específica
Write-Host "`n4. Obteniendo empresa específica..." -ForegroundColor Yellow
try {
    $specificCompany = Invoke-RestMethod -Uri "$baseUrl/companies/$($createdCompany.id)" -Method GET -Headers $headers
    Write-Host "✅ Empresa específica obtenida: $($specificCompany.companyName)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo empresa específica: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Actualizar la empresa
Write-Host "`n5. Actualizando empresa..." -ForegroundColor Yellow
$updateCompany = @{
    companyName = "Empresa de Prueba Actualizada"
    companyRun = "76.543.210-K"
    logoIrid = "updated-logo"
    bannerIrid = "updated-banner"
    htmlIrid = "updated-html"
    contactRut = "12.345.678-9"
    contactName = "María"
    contactSurname = "González"
    contactEmail = "maria.gonzalez@empresa.com"
    contactPhone = "+56 9 8765 4321"
    contactDirStates = 1
    contactDirCounty = 1
    contactDirStreet1 = "Avenida Principal"
    contactDirStreet2 = "Sector Norte"
    contactDirStNumber = "456"
    contactDirInNumber = "B"
} | ConvertTo-Json

try {
    $updatedCompany = Invoke-RestMethod -Uri "$baseUrl/companies/$($createdCompany.id)" -Method PUT -Body $updateCompany -Headers $headers
    Write-Host "✅ Empresa actualizada exitosamente: $($updatedCompany.companyName)" -ForegroundColor Green
    Write-Host "  Contacto: $($updatedCompany.contactName) $($updatedCompany.contactSurname)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error actualizando empresa: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Eliminar la empresa
Write-Host "`n6. Eliminando empresa..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/companies/$($createdCompany.id)" -Method DELETE -Headers $headers
    Write-Host "✅ Empresa eliminada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error eliminando empresa: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Pruebas completadas ===" -ForegroundColor Green 