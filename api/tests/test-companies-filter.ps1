# Test script for companies filtering based on user type
$baseUrl = "http://localhost:5100"

Write-Host "=== Testing Companies Filtering ===" -ForegroundColor Green

# Test 1: Login as admin user
Write-Host "`n1. Testing as ADMIN user..." -ForegroundColor Yellow
$adminLoginBody = @{
    run = "11111111-1"
    passwordHash = "password!"
} | ConvertTo-Json

$adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminResponse.token

Write-Host "Admin token obtained: $($adminToken.Substring(0, 20))..." -ForegroundColor Cyan

# Get companies as admin
$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
}

$adminCompanies = Invoke-RestMethod -Uri "$baseUrl/companies" -Method GET -Headers $adminHeaders
Write-Host "Admin can see $($adminCompanies.Count) companies:" -ForegroundColor Green
$adminCompanies | ForEach-Object { Write-Host "  - $($_.companyName)" -ForegroundColor White }

# Test 2: Login as moderator user
Write-Host "`n2. Testing as MODERATOR user..." -ForegroundColor Yellow
$moderatorLoginBody = @{
    run = "22222222-2"
    passwordHash = "password!"
} | ConvertTo-Json

$moderatorResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $moderatorLoginBody -ContentType "application/json"
$moderatorToken = $moderatorResponse.token

Write-Host "Moderator token obtained: $($moderatorToken.Substring(0, 20))..." -ForegroundColor Cyan

# Get companies as moderator
$moderatorHeaders = @{
    "Authorization" = "Bearer $moderatorToken"
}

$moderatorCompanies = Invoke-RestMethod -Uri "$baseUrl/companies" -Method GET -Headers $moderatorHeaders
Write-Host "Moderator can see $($moderatorCompanies.Count) companies:" -ForegroundColor Green
$moderatorCompanies | ForEach-Object { Write-Host "  - $($_.companyName)" -ForegroundColor White }

# Test 3: Login as regular user
Write-Host "`n3. Testing as REGULAR user..." -ForegroundColor Yellow
$userLoginBody = @{
    run = "33333333-3"
    passwordHash = "password!"
} | ConvertTo-Json

$userResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $userLoginBody -ContentType "application/json"
$userToken = $userResponse.token

Write-Host "Regular user token obtained: $($userToken.Substring(0, 20))..." -ForegroundColor Cyan

# Get companies as regular user
$userHeaders = @{
    "Authorization" = "Bearer $userToken"
}

$userCompanies = Invoke-RestMethod -Uri "$baseUrl/companies" -Method GET -Headers $userHeaders
Write-Host "Regular user can see $($userCompanies.Count) companies:" -ForegroundColor Green
$userCompanies | ForEach-Object { Write-Host "  - $($_.companyName)" -ForegroundColor White }

# Test 4: Try to access without authentication
Write-Host "`n4. Testing WITHOUT authentication..." -ForegroundColor Yellow
try {
    $noAuthCompanies = Invoke-RestMethod -Uri "$baseUrl/companies" -Method GET
    Write-Host "ERROR: Should not be able to access without authentication!" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Cannot access companies without authentication" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host "`n=== Test completed ===" -ForegroundColor Green 