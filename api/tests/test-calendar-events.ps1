# Test script for calendar events
$baseUrl = "http://localhost:5100"

Write-Host "=== Testing Calendar Events ===" -ForegroundColor Green

# Login as admin to test event management
Write-Host "`n1. Login as ADMIN user..." -ForegroundColor Yellow
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

# Test 2: Get all events
Write-Host "`n2. Getting all events..." -ForegroundColor Yellow
$events = Invoke-RestMethod -Uri "$baseUrl/events" -Method GET

Write-Host "Found $($events.Count) public events:" -ForegroundColor Green
foreach ($event in $events) {
    Write-Host "  - $($event.eventName) ($($event.companyName))" -ForegroundColor White
    Write-Host "    Start: $($event.startDate)" -ForegroundColor Gray
    Write-Host "    End: $($event.endDate)" -ForegroundColor Gray
    Write-Host "    Public: $($event.public)" -ForegroundColor Gray
}

# Test 3: Get all events (including private ones)
Write-Host "`n3. Getting all events (including private)..." -ForegroundColor Yellow
$allEvents = Invoke-RestMethod -Uri "$baseUrl/events/all" -Method GET -Headers $adminHeaders

Write-Host "Found $($allEvents.Count) total events:" -ForegroundColor Green
foreach ($event in $allEvents) {
    Write-Host "  - $($event.eventName) ($($event.companyName))" -ForegroundColor White
    Write-Host "    Start: $($event.startDate)" -ForegroundColor Gray
    Write-Host "    End: $($event.endDate)" -ForegroundColor Gray
    Write-Host "    Public: $($event.public)" -ForegroundColor Gray
}

# Test 4: Create a test event for today
Write-Host "`n4. Creating a test event for today..." -ForegroundColor Yellow

$today = Get-Date
$tomorrow = (Get-Date).AddDays(1)

$testEvent = @{
    slug = "test-event-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    eventName = "Evento de Prueba - Calendario"
    eventDescription = "Este es un evento de prueba para verificar el calendario"
    startDate = $today.ToString("yyyy-MM-ddTHH:mm:ss")
    endDate = $today.AddHours(8).ToString("yyyy-MM-ddTHH:mm:ss")
    logoIrid = ""
    bannerIrid = ""
    templateIrid = ""
    cssIrid = ""
    public = $true
    companyId = 1
}

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/events" -Method POST -Body ($testEvent | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json"
    Write-Host "SUCCESS: Test event created" -ForegroundColor Green
    Write-Host "Event ID: $($createResponse.id)" -ForegroundColor Cyan
    Write-Host "Event Slug: $($createResponse.slug)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Could not create test event" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 5: Create a test event for tomorrow
Write-Host "`n5. Creating a test event for tomorrow..." -ForegroundColor Yellow

$testEvent2 = @{
    slug = "test-event-tomorrow-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    eventName = "Evento de Prueba - Mañana"
    eventDescription = "Este es un evento de prueba para mañana"
    startDate = $tomorrow.AddHours(14).ToString("yyyy-MM-ddTHH:mm:ss")
    endDate = $tomorrow.AddHours(20).ToString("yyyy-MM-ddTHH:mm:ss")
    logoIrid = ""
    bannerIrid = ""
    templateIrid = ""
    cssIrid = ""
    public = $true
    companyId = 1
}

try {
    $createResponse2 = Invoke-RestMethod -Uri "$baseUrl/events" -Method POST -Body ($testEvent2 | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json"
    Write-Host "SUCCESS: Tomorrow test event created" -ForegroundColor Green
    Write-Host "Event ID: $($createResponse2.id)" -ForegroundColor Cyan
    Write-Host "Event Slug: $($createResponse2.slug)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Could not create tomorrow test event" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 6: Verify events are now available
Write-Host "`n6. Verifying events are available..." -ForegroundColor Yellow
$updatedEvents = Invoke-RestMethod -Uri "$baseUrl/events" -Method GET

Write-Host "Now found $($updatedEvents.Count) public events:" -ForegroundColor Green
foreach ($event in $updatedEvents) {
    Write-Host "  - $($event.eventName) ($($event.companyName))" -ForegroundColor White
    Write-Host "    Start: $($event.startDate)" -ForegroundColor Gray
    Write-Host "    End: $($event.endDate)" -ForegroundColor Gray
}

Write-Host "`n=== Test completed ===" -ForegroundColor Green
Write-Host "You can now test the calendar in the frontend!" -ForegroundColor Cyan 