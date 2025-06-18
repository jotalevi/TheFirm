# Script para probar endpoints de gestión de roles de usuario
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

# Obtener usuarios
Write-Host "`n👥 Obteniendo usuarios..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET -Headers $headers
    Write-Host "✅ Usuarios obtenidos: $($usersResponse.Count) usuarios" -ForegroundColor Green
    
    if ($usersResponse.Count -eq 0) {
        Write-Host "❌ No hay usuarios disponibles." -ForegroundColor Red
        exit 1
    }
    
    $firstUser = $usersResponse[0]
    $userRun = $firstUser.run
    Write-Host "📋 Usando usuario: $($firstUser.firstNames) $($firstUser.lastNames) (RUN: $userRun)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error obteniendo usuarios: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Obtener empresas para moderación
Write-Host "`n🏢 Obteniendo empresas..." -ForegroundColor Yellow
try {
    $companiesResponse = Invoke-RestMethod -Uri "$baseUrl/companies" -Method GET -Headers $headers
    Write-Host "✅ Empresas obtenidas: $($companiesResponse.Count) empresas" -ForegroundColor Green
    
    if ($companiesResponse.Count -eq 0) {
        Write-Host "❌ No hay empresas disponibles." -ForegroundColor Red
        exit 1
    }
    
    $firstCompany = $companiesResponse[0]
    $companyId = $firstCompany.id
    Write-Host "📋 Usando empresa: $($firstCompany.companyName) (ID: $companyId)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error obteniendo empresas: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Obtener empresas moderadas del usuario
Write-Host "`n🔍 Obteniendo empresas moderadas del usuario..." -ForegroundColor Yellow
try {
    $moderatedCompaniesResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userRun/companies-moderated" -Method GET -Headers $headers
    Write-Host "✅ Empresas moderadas obtenidas: $($moderatedCompaniesResponse.Count) empresas" -ForegroundColor Green
    
    foreach ($companyId in $moderatedCompaniesResponse) {
        Write-Host "  - Empresa ID: $companyId" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error obteniendo empresas moderadas: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar hacer admin al usuario
Write-Host "`n👑 Probando hacer admin al usuario..." -ForegroundColor Yellow
try {
    $setAdminResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userRun/admin" -Method PUT -Body "true" -Headers $headers
    Write-Host "✅ Usuario hecho admin exitosamente" -ForegroundColor Green
    Write-Host "  Mensaje: $($setAdminResponse.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Error haciendo admin al usuario: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar agregar moderación de empresa
Write-Host "`n➕ Probando agregar moderación de empresa..." -ForegroundColor Yellow
try {
    $addModResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userRun/moderate-company/$companyId" -Method POST -Headers $headers
    Write-Host "✅ Moderación de empresa agregada exitosamente" -ForegroundColor Green
    Write-Host "  Mensaje: $($addModResponse.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Error agregando moderación de empresa: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar empresas moderadas actualizadas
Write-Host "`n🔍 Verificando empresas moderadas actualizadas..." -ForegroundColor Yellow
try {
    $updatedModeratedCompaniesResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userRun/companies-moderated" -Method GET -Headers $headers
    Write-Host "✅ Empresas moderadas actualizadas: $($updatedModeratedCompaniesResponse.Count) empresas" -ForegroundColor Green
    
    foreach ($companyId in $updatedModeratedCompaniesResponse) {
        Write-Host "  - Empresa ID: $companyId" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error obteniendo empresas moderadas actualizadas: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar quitar moderación de empresa
Write-Host "`n➖ Probando quitar moderación de empresa..." -ForegroundColor Yellow
try {
    $removeModResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userRun/moderate-company/$companyId" -Method DELETE -Headers $headers
    Write-Host "✅ Moderación de empresa removida exitosamente" -ForegroundColor Green
    Write-Host "  Mensaje: $($removeModResponse.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Error removiendo moderación de empresa: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar quitar admin al usuario
Write-Host "`n👤 Probando quitar admin al usuario..." -ForegroundColor Yellow
try {
    $removeAdminResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userRun/admin" -Method PUT -Body "false" -Headers $headers
    Write-Host "✅ Admin removido exitosamente" -ForegroundColor Green
    Write-Host "  Mensaje: $($removeAdminResponse.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Error removiendo admin al usuario: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar estado final
Write-Host "`n🔍 Verificando estado final..." -ForegroundColor Yellow
try {
    $finalUserResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userRun" -Method GET -Headers $headers
    Write-Host "✅ Estado final del usuario:" -ForegroundColor Green
    Write-Host "  Nombre: $($finalUserResponse.firstNames) $($finalUserResponse.lastNames)" -ForegroundColor White
    Write-Host "  Email: $($finalUserResponse.email)" -ForegroundColor White
    Write-Host "  Es Admin: $($finalUserResponse.isAdmin)" -ForegroundColor White
    
    $finalModeratedCompaniesResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userRun/companies-moderated" -Method GET -Headers $headers
    Write-Host "  Empresas moderadas: $($finalModeratedCompaniesResponse.Count)" -ForegroundColor White
} catch {
    Write-Host "❌ Error verificando estado final: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Pruebas de gestión de roles de usuario completadas" -ForegroundColor Green 