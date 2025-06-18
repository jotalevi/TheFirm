# Test script for user roles display
$baseUrl = "http://localhost:5100"

Write-Host "=== Testing User Roles Display ===" -ForegroundColor Green

# Login as admin to test user management
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

# Test 2: Get all users to see their roles
Write-Host "`n2. Getting all users..." -ForegroundColor Yellow
$users = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET -Headers $adminHeaders

Write-Host "Found $($users.Count) users:" -ForegroundColor Green
foreach ($user in $users) {
    $roles = @()
    if ($user.isAdmin) { $roles += "Admin" }
    
    # Check if user moderates any companies
    try {
        $moderatedCompanies = Invoke-RestMethod -Uri "$baseUrl/users/$($user.run)/companies-moderated" -Method GET -Headers $adminHeaders
        if ($moderatedCompanies.Count -gt 0) {
            $roles += "Moderator"
        }
    } catch {
        # User doesn't moderate any companies
    }
    
    if ($roles.Count -eq 0) {
        $roles += "Usuario"
    }
    
    $roleText = $roles -join ", "
    Write-Host "  - $($user.firstNames) $($user.lastNames) ($($user.run)): $roleText" -ForegroundColor White
}

# Test 3: Test adding a user as moderator of a company
Write-Host "`n3. Testing moderator role assignment..." -ForegroundColor Yellow

# Get companies first
$companies = Invoke-RestMethod -Uri "$baseUrl/companies" -Method GET -Headers $adminHeaders
$firstCompany = $companies[0]

Write-Host "Adding user 33333333-3 as moderator of company: $($firstCompany.companyName)" -ForegroundColor Cyan

try {
    $addModeratorResponse = Invoke-RestMethod -Uri "$baseUrl/users/33333333-3/moderate-company/$($firstCompany.id)" -Method POST -Headers $adminHeaders
    Write-Host "SUCCESS: User added as moderator" -ForegroundColor Green
    
    # Verify the user is now a moderator
    $moderatedCompanies = Invoke-RestMethod -Uri "$baseUrl/users/33333333-3/companies-moderated" -Method GET -Headers $adminHeaders
    Write-Host "User now moderates $($moderatedCompanies.Count) companies" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: Could not add user as moderator" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 4: Remove moderator role
Write-Host "`n4. Testing moderator role removal..." -ForegroundColor Yellow

try {
    $removeModeratorResponse = Invoke-RestMethod -Uri "$baseUrl/users/33333333-3/moderate-company/$($firstCompany.id)" -Method DELETE -Headers $adminHeaders
    Write-Host "SUCCESS: User removed as moderator" -ForegroundColor Green
    
    # Verify the user is no longer a moderator
    $moderatedCompanies = Invoke-RestMethod -Uri "$baseUrl/users/33333333-3/companies-moderated" -Method GET -Headers $adminHeaders
    Write-Host "User now moderates $($moderatedCompanies.Count) companies" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: Could not remove user as moderator" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host "`n=== Test completed ===" -ForegroundColor Green 