# Script para probar endpoints de tickets
$baseUrl = "http://localhost:5000"
$loginUrl = "$baseUrl/auth/login"

# Credenciales del admin
$loginData = @{
    run = "12345678-9"
    password = "password!"
} | ConvertTo-Json

Write-Host "🔐 Iniciando sesión..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Headers con token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Obtener eventos primero
Write-Host "`n📅 Obteniendo eventos..." -ForegroundColor Yellow
try {
    $eventsResponse = Invoke-RestMethod -Uri "$baseUrl/events/all" -Method GET -Headers $headers
    Write-Host "✅ Eventos obtenidos: $($eventsResponse.Count) eventos" -ForegroundColor Green
    
    if ($eventsResponse.Count -eq 0) {
        Write-Host "❌ No hay eventos disponibles. Crear un evento primero." -ForegroundColor Red
        exit 1
    }
    
    $firstEvent = $eventsResponse[0]
    $eventSlug = $firstEvent.slug
    Write-Host "📋 Usando evento: $($firstEvent.eventName) (Slug: $eventSlug)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error obteniendo eventos: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Obtener tiers del evento
Write-Host "`n🎫 Obteniendo tiers del evento..." -ForegroundColor Yellow
try {
    $tiersResponse = Invoke-RestMethod -Uri "$baseUrl/events/$eventSlug/tiers" -Method GET -Headers $headers
    Write-Host "✅ Tiers obtenidos: $($tiersResponse.Count) tiers" -ForegroundColor Green
    
    foreach ($tier in $tiersResponse) {
        Write-Host "  - $($tier.tierName): $${$tier.basePrice} (Stock: $($tier.stockCurrent)/$($tier.stockInitial))" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error obteniendo tiers: $($_.Exception.Message)" -ForegroundColor Red
}

# Crear un nuevo tier
Write-Host "`n➕ Creando nuevo tier..." -ForegroundColor Yellow
$newTierData = @{
    tierName = "VIP Premium"
    basePrice = 75000
    entryAllowedFrom = "2024-12-01T08:00:00"
    entryAllowedTo = "2024-12-01T23:59:59"
    singleUse = $true
    singleDaily = $false
    tierPdfTemplateIrid = "template_vip_001"
    tierMailTemplateIrid = "email_vip_001"
    stockInitial = 50
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/events/$eventSlug/tiers" -Method POST -Body $newTierData -Headers $headers
    Write-Host "✅ Tier creado exitosamente" -ForegroundColor Green
    Write-Host "  ID: $($createResponse.id)" -ForegroundColor White
    Write-Host "  Nombre: $($createResponse.tierName)" -ForegroundColor White
    Write-Host "  Precio: $${$createResponse.basePrice}" -ForegroundColor White
    
    $newTierId = $createResponse.id
} catch {
    Write-Host "❌ Error creando tier: $($_.Exception.Message)" -ForegroundColor Red
    $newTierId = $null
}

# Obtener detalles del tier creado
if ($newTierId) {
    Write-Host "`n🔍 Obteniendo detalles del tier creado..." -ForegroundColor Yellow
    try {
        $tierDetailResponse = Invoke-RestMethod -Uri "$baseUrl/events/$eventSlug/tiers/$newTierId" -Method GET -Headers $headers
        Write-Host "✅ Detalles del tier obtenidos" -ForegroundColor Green
        Write-Host "  Stock Actual: $($tierDetailResponse.stockCurrent)" -ForegroundColor White
        Write-Host "  Stock Vendido: $($tierDetailResponse.stockSold)" -ForegroundColor White
        Write-Host "  Evento: $($tierDetailResponse.eventName)" -ForegroundColor White
    } catch {
        Write-Host "❌ Error obteniendo detalles del tier: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Actualizar el tier
if ($newTierId) {
    Write-Host "`n✏️ Actualizando tier..." -ForegroundColor Yellow
    $updateTierData = @{
        tierName = "VIP Premium Actualizado"
        basePrice = 85000
        entryAllowedFrom = "2024-12-01T09:00:00"
        entryAllowedTo = "2024-12-01T22:00:00"
        singleUse = $true
        singleDaily = $true
        tierPdfTemplateIrid = "template_vip_002"
        tierMailTemplateIrid = "email_vip_002"
        stockInitial = 75
    } | ConvertTo-Json

    try {
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/events/$eventSlug/tiers/$newTierId" -Method PUT -Body $updateTierData -Headers $headers
        Write-Host "✅ Tier actualizado exitosamente" -ForegroundColor Green
        Write-Host "  Nuevo nombre: $($updateResponse.tierName)" -ForegroundColor White
        Write-Host "  Nuevo precio: $${$updateResponse.basePrice}" -ForegroundColor White
        Write-Host "  Nuevo stock: $($updateResponse.stockInitial)" -ForegroundColor White
    } catch {
        Write-Host "❌ Error actualizando tier: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Listar todos los tiers actualizados
Write-Host "`n📋 Listando todos los tiers actualizados..." -ForegroundColor Yellow
try {
    $updatedTiersResponse = Invoke-RestMethod -Uri "$baseUrl/events/$eventSlug/tiers" -Method GET -Headers $headers
    Write-Host "✅ Tiers actualizados obtenidos: $($updatedTiersResponse.Count) tiers" -ForegroundColor Green
    
    foreach ($tier in $updatedTiersResponse) {
        Write-Host "  - $($tier.tierName): $${$tier.basePrice} (Stock: $($tier.stockCurrent)/$($tier.stockInitial))" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error obteniendo tiers actualizados: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Pruebas de tickets completadas" -ForegroundColor Green 