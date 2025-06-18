# Test script for events access for all users
$baseUrl = "http://localhost:5100"

Write-Host "=== Testing Events Access for All Users ===" -ForegroundColor Green

# Login as admin to create test events
Write-Host "`n0. Login as ADMIN to create test events..." -ForegroundColor Yellow
$adminLoginBody = @{
    run = "11111111-1"
    passwordHash = "password!"
} | ConvertTo-Json

$adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminResponse.token

Write-Host "Admin token obtained: $($adminToken.Substring(0, 20))..." -ForegroundColor Cyan

$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
}

# Create test events
Write-Host "`n0.1. Creating test events..." -ForegroundColor Yellow

$today = Get-Date
$tomorrow = (Get-Date).AddDays(1)

# Public event
$publicEvent = @{
    slug = "public-event-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    eventName = "Evento Público de Prueba"
    eventDescription = "Este es un evento público para probar el acceso"
    startDate = $today.AddHours(10).ToString("yyyy-MM-ddTHH:mm:ss")
    endDate = $today.AddHours(18).ToString("yyyy-MM-ddTHH:mm:ss")
    logoIrid = ""
    bannerIrid = ""
    templateIrid = ""
    cssIrid = ""
    public = $true
    companyId = 1
}

# Private event
$privateEvent = @{
    slug = "private-event-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    eventName = "Evento Privado de Prueba"
    eventDescription = "Este es un evento privado para probar el acceso"
    startDate = $tomorrow.AddHours(14).ToString("yyyy-MM-ddTHH:mm:ss")
    endDate = $tomorrow.AddHours(20).ToString("yyyy-MM-ddTHH:mm:ss")
    logoIrid = ""
    bannerIrid = ""
    templateIrid = ""
    cssIrid = ""
    public = $false
    companyId = 1
}

try {
    $createPublicResponse = Invoke-RestMethod -Uri "$baseUrl/events" -Method POST -Body ($publicEvent | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json"
    Write-Host "SUCCESS: Public test event created" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Could not create public test event" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

try {
    $createPrivateResponse = Invoke-RestMethod -Uri "$baseUrl/events" -Method POST -Body ($privateEvent | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json"
    Write-Host "SUCCESS: Private test event created" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Could not create private test event" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 1: Login as admin user
Write-Host "`n1. Testing as ADMIN user..." -ForegroundColor Yellow

# Get all events as admin
$adminEvents = Invoke-RestMethod -Uri "$baseUrl/events" -Method GET -Headers $adminHeaders
Write-Host "Admin can see $($adminEvents.Count) events:" -ForegroundColor Green
$adminEvents | ForEach-Object { Write-Host "  - $($_.eventName) (Public: $($_.public))" -ForegroundColor White }

# Test 2: Login as regular user
Write-Host "`n2. Testing as REGULAR user..." -ForegroundColor Yellow
$userLoginBody = @{
    run = "33333333-3"
    passwordHash = "password!"
} | ConvertTo-Json

$userResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $userLoginBody -ContentType "application/json"
$userToken = $userResponse.token

Write-Host "Regular user token obtained: $($userToken.Substring(0, 20))..." -ForegroundColor Cyan

$userHeaders = @{
    "Authorization" = "Bearer $userToken"
}

# Get all events as regular user
$userEvents = Invoke-RestMethod -Uri "$baseUrl/events" -Method GET -Headers $userHeaders
Write-Host "Regular user can see $($userEvents.Count) events:" -ForegroundColor Green
$userEvents | ForEach-Object { Write-Host "  - $($_.eventName) (Public: $($_.public))" -ForegroundColor White }

# Test 3: Test public events endpoint (no authentication)
Write-Host "`n3. Testing PUBLIC events endpoint (no auth)..." -ForegroundColor Yellow
$publicEvents = Invoke-RestMethod -Uri "$baseUrl/events/public" -Method GET
Write-Host "Public endpoint shows $($publicEvents.Count) events:" -ForegroundColor Green
$publicEvents | ForEach-Object { Write-Host "  - $($_.eventName) (Public: $($_.public))" -ForegroundColor White }

# Test 4: Test ticket tiers access
Write-Host "`n4. Testing ticket tiers access..." -ForegroundColor Yellow

if ($adminEvents.Count -gt 0) {
    $firstEvent = $adminEvents[0]
    Write-Host "Testing ticket tiers for event: $($firstEvent.eventName)" -ForegroundColor Cyan
    
    # Get tiers as admin
    $adminTiers = Invoke-RestMethod -Uri "$baseUrl/events/$($firstEvent.slug)/tiers" -Method GET -Headers $adminHeaders
    Write-Host "Admin can see $($adminTiers.Count) ticket tiers:" -ForegroundColor Green
    $adminTiers | ForEach-Object { Write-Host "  - $($_.tierName) ($$($_.basePrice))" -ForegroundColor White }
    
    # Get tiers as regular user
    $userTiers = Invoke-RestMethod -Uri "$baseUrl/events/$($firstEvent.slug)/tiers" -Method GET -Headers $userHeaders
    Write-Host "Regular user can see $($userTiers.Count) ticket tiers:" -ForegroundColor Green
    $userTiers | ForEach-Object { Write-Host "  - $($_.tierName) ($$($_.basePrice))" -ForegroundColor White }
} else {
    Write-Host "No events available to test ticket tiers" -ForegroundColor Yellow
}

# Test 5: Test individual event access
Write-Host "`n5. Testing individual event access..." -ForegroundColor Yellow

if ($adminEvents.Count -gt 0) {
    $firstEvent = $adminEvents[0]
    
    # Get event details as admin
    $adminEventDetail = Invoke-RestMethod -Uri "$baseUrl/events/$($firstEvent.slug)" -Method GET -Headers $adminHeaders
    Write-Host "Admin can access event: $($adminEventDetail.eventName)" -ForegroundColor Green
    
    # Get event details as regular user
    $userEventDetail = Invoke-RestMethod -Uri "$baseUrl/events/$($firstEvent.slug)" -Method GET -Headers $userHeaders
    Write-Host "Regular user can access event: $($userEventDetail.eventName)" -ForegroundColor Green
} else {
    Write-Host "No events available to test individual access" -ForegroundColor Yellow
}

Write-Host "`n=== Test completed ===" -ForegroundColor Green 