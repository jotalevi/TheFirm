#!/usr/bin/env pwsh
# Script para probar los endpoints de TheFirmApi

$baseUrl = "http://localhost:5000"
$token = ""

# Función para realizar solicitudes HTTP
function Invoke-ApiRequest {
    param (
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [bool]$UseAuth = $false
    )

    $uri = "$baseUrl$Endpoint"
    $headers = @{
        "Content-Type" = "application/json"
    }

    if ($UseAuth -and $token) {
        $headers["Authorization"] = "Bearer $token"
    }

    $params = @{
        Method = $Method
        Uri = $uri
        Headers = $headers
    }

    if ($Body -ne $null) {
        $params["Body"] = ($Body | ConvertTo-Json)
    }

    try {
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Host "Error en $Method $Endpoint"
        Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__
        Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription
        
        if ($_.ErrorDetails.Message) {
            Write-Host "Mensaje:" $_.ErrorDetails.Message
        }
        return $null
    }
}

# Iniciar Docker Compose para la API y la base de datos
Write-Host "Iniciando Docker Compose..." -ForegroundColor Green
docker-compose up -d
Start-Sleep -Seconds 30  # Esperar a que la API esté lista

try {
    # Probar registro y autenticación
    Write-Host "`nProbando Auth Endpoints..." -ForegroundColor Yellow
    
    $registerData = @{
        run = "25535866-9"
        firstNames = "Test"
        lastNames = "User"
        email = "test@example.com"
        phone = "+56912345678"
        dirStreet1 = "Test Street"
        dirStreet2 = ""
        dirStNumber = "123"
        dirInNumber = ""
        notify = $true
        passwordHash = "TestPassword123!"
    }
    
    $registerResult = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/register" -Body $registerData
    Write-Host "Registro de usuario:" ($registerResult -ne $null)
    
    $loginData = @{
        run = "25535866-9"
        passwordHash = "TestPassword123!"
    }
    
    $loginResult = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/login" -Body $loginData
    $token = $loginResult.token
    Write-Host "Login exitoso:" ($token -ne $null)
    
    # Probar endpoints de usuarios
    Write-Host "`nProbando User Endpoints..." -ForegroundColor Yellow
    
    $getUserResult = Invoke-ApiRequest -Method "GET" -Endpoint "/users/25535866-9" -UseAuth $true
    Write-Host "Get User:" ($getUserResult -ne $null)
    
    $updateUserData = @{
        firstNames = "Updated"
        lastNames = "User"
        email = "updated@example.com"
        phone = "+56912345678"
        dirStreet1 = "Updated Street"
        dirStreet2 = ""
        dirStNumber = "456"
        dirInNumber = ""
        notify = $true
    }
    
    $updateUserResult = Invoke-ApiRequest -Method "PUT" -Endpoint "/users/25535866-9" -Body $updateUserData -UseAuth $true
    Write-Host "Update User:" ($updateUserResult -ne $null)
    
    $getUserTicketsResult = Invoke-ApiRequest -Method "GET" -Endpoint "/users/25535866-9/tickets" -UseAuth $true
    Write-Host "Get User Tickets:" ($getUserTicketsResult -ne $null)
    
    $getUserOrdersResult = Invoke-ApiRequest -Method "GET" -Endpoint "/users/25535866-9/orders" -UseAuth $true
    Write-Host "Get User Orders:" ($getUserOrdersResult -ne $null)
    
    # Probar endpoints de compañías
    Write-Host "`nProbando Company Endpoints..." -ForegroundColor Yellow
    
    $createCompanyData = @{
        companyName = "Test Company"
        companyRun = "12345678-9"
        contactRut = "12345678-9"
        contactName = "Contact"
        contactSurname = "Person"
        contactEmail = "contact@example.com"
        contactPhone = "+56912345678"
        contactDirStreet1 = "Contact Street"
        contactDirStNumber = "789"
    }
    
    $createCompanyResult = Invoke-ApiRequest -Method "POST" -Endpoint "/companies" -Body $createCompanyData -UseAuth $true
    Write-Host "Create Company:" ($createCompanyResult -ne $null)
    
    if ($createCompanyResult -ne $null) {
        $companyId = $createCompanyResult.id
        
        $getCompanyResult = Invoke-ApiRequest -Method "GET" -Endpoint "/companies/$companyId" -UseAuth $true
        Write-Host "Get Company:" ($getCompanyResult -ne $null)
        
        $getCompaniesResult = Invoke-ApiRequest -Method "GET" -Endpoint "/companies" -UseAuth $true
        Write-Host "Get All Companies:" ($getCompaniesResult -ne $null)
        
        $getCompanyEventsResult = Invoke-ApiRequest -Method "GET" -Endpoint "/companies/$companyId/events" -UseAuth $true
        Write-Host "Get Company Events:" ($getCompanyEventsResult -ne $null)
        
        # Probar endpoints de eventos
        Write-Host "`nProbando Event Endpoints..." -ForegroundColor Yellow
        
        $createEventData = @{
            slug = "test-event"
            eventName = "Test Event"
            eventDescription = "A test event for API testing"
            startDate = (Get-Date).AddDays(30).ToString("o")
            endDate = (Get-Date).AddDays(31).ToString("o")
            public = $true
            companyId = $companyId
        }
        
        $createEventResult = Invoke-ApiRequest -Method "POST" -Endpoint "/events" -Body $createEventData -UseAuth $true
        Write-Host "Create Event:" ($createEventResult -ne $null)
        
        if ($createEventResult -ne $null) {
            $eventSlug = $createEventResult.slug
            
            $getEventResult = Invoke-ApiRequest -Method "GET" -Endpoint "/events/$eventSlug" -UseAuth $true
            Write-Host "Get Event:" ($getEventResult -ne $null)
            
            $getEventsResult = Invoke-ApiRequest -Method "GET" -Endpoint "/events" -UseAuth $false
            Write-Host "Get All Events:" ($getEventsResult -ne $null)
            
            $updateEventData = @{
                eventName = "Updated Event"
                eventDescription = "An updated test event"
                startDate = (Get-Date).AddDays(40).ToString("o")
                endDate = (Get-Date).AddDays(41).ToString("o")
                public = $true
            }
            
            $updateEventResult = Invoke-ApiRequest -Method "PUT" -Endpoint "/events/$eventSlug" -Body $updateEventData -UseAuth $true
            Write-Host "Update Event:" ($updateEventResult -ne $null)
            
            # Probar endpoints de niveles de tickets
            Write-Host "`nProbando Ticket Tier Endpoints..." -ForegroundColor Yellow
            
            $createTicketTierData = @{
                tierName = "VIP"
                basePrice = 100.00
                entryAllowedFrom = (Get-Date).AddDays(30).ToString("o")
                entryAllowedTo = (Get-Date).AddDays(31).ToString("o")
                singleUse = $true
                singleDaily = $false
                stockInitial = 100
            }
            
            $createTicketTierResult = Invoke-ApiRequest -Method "POST" -Endpoint "/events/$eventSlug/tiers" -Body $createTicketTierData -UseAuth $true
            Write-Host "Create Ticket Tier:" ($createTicketTierResult -ne $null)
            
            if ($createTicketTierResult -ne $null) {
                $tierId = $createTicketTierResult.id
                
                $getEventTiersResult = Invoke-ApiRequest -Method "GET" -Endpoint "/events/$eventSlug/tiers" -UseAuth $false
                Write-Host "Get Event Tiers:" ($getEventTiersResult -ne $null)
                
                $getEventTierDetailResult = Invoke-ApiRequest -Method "GET" -Endpoint "/events/$eventSlug/tiers/$tierId" -UseAuth $false
                Write-Host "Get Event Tier Detail:" ($getEventTierDetailResult -ne $null)
                
                # Probar endpoints de cupones
                Write-Host "`nProbando Coupon Endpoints..." -ForegroundColor Yellow
                
                $createCouponData = @{
                    code = "TEST50"
                    description = "50% off for testing"
                    discountType = "percentage"
                    discountValue = 50
                    usageLimit = 100
                    validFrom = (Get-Date).ToString("o")
                    validTo = (Get-Date).AddDays(60).ToString("o")
                    eventId = $createEventResult.id
                    active = $true
                }
                
                $createCouponResult = Invoke-ApiRequest -Method "POST" -Endpoint "/coupons" -Body $createCouponData -UseAuth $true
                Write-Host "Create Coupon:" ($createCouponResult -ne $null)
                
                if ($createCouponResult -ne $null) {
                    $couponCode = $createCouponResult.code
                    
                    $getCouponResult = Invoke-ApiRequest -Method "GET" -Endpoint "/coupons/$couponCode" -UseAuth $true
                    Write-Host "Get Coupon:" ($getCouponResult -ne $null)
                    
                    $applyCouponResult = Invoke-ApiRequest -Method "POST" -Endpoint "/coupons/$couponCode" -UseAuth $true
                    Write-Host "Apply Coupon:" ($applyCouponResult -ne $null)
                    
                    # Probar endpoints de órdenes
                    Write-Host "`nProbando Order Endpoints..." -ForegroundColor Yellow
                    
                    $createOrderData = @{
                        userRun = "25535866-9"
                        paymentMethod = "credit_card"
                        couponCode = $couponCode
                        items = @(
                            @{
                                tierId = $tierId
                                quantity = 2
                            }
                        )
                    }
                    
                    $createOrderResult = Invoke-ApiRequest -Method "POST" -Endpoint "/orders" -Body $createOrderData -UseAuth $true
                    Write-Host "Create Order:" ($createOrderResult -ne $null)
                    
                    if ($createOrderResult -ne $null) {
                        $orderId = $createOrderResult.id
                        
                        $getOrderResult = Invoke-ApiRequest -Method "GET" -Endpoint "/orders/$orderId" -UseAuth $true
                        Write-Host "Get Order:" ($getOrderResult -ne $null)
                    }
                }
            }
            
            # Probar endpoints de calendario
            Write-Host "`nProbando Calendar Endpoints..." -ForegroundColor Yellow
            
            $getCalendarResult = Invoke-ApiRequest -Method "GET" -Endpoint "/calendar" -UseAuth $false
            Write-Host "Get Calendar Events:" ($getCalendarResult -ne $null)
            
            $getCalendarFilteredResult = Invoke-ApiRequest -Method "GET" -Endpoint "/calendar?q=Test&from=$((Get-Date).ToString('yyyy-MM-dd'))&to=$((Get-Date).AddDays(60).ToString('yyyy-MM-dd'))&external=true" -UseAuth $false
            Write-Host "Get Calendar Events Filtered:" ($getCalendarFilteredResult -ne $null)
            
            # Probar endpoints de analíticas
            Write-Host "`nProbando Analytics Endpoints..." -ForegroundColor Yellow
            
            $createSessionData = @{
                userRun = "25535866-9"
                ipAddress = "127.0.0.1"
                userAgent = "Test/1.0"
            }
            
            $createSessionResult = Invoke-ApiRequest -Method "POST" -Endpoint "/analytics/session" -Body $createSessionData -UseAuth $false
            Write-Host "Create Analytics Session:" ($createSessionResult -ne $null)
            
            if ($createSessionResult -ne $null) {
                $sessionId = $createSessionResult.sessionId
                
                $createEventData = @{
                    sessionId = $sessionId
                    eventName = "page_view"
                    metadata = "{ 'page': 'home' }"
                }
                
                $createAnalyticsEventResult = Invoke-ApiRequest -Method "POST" -Endpoint "/analytics/event" -Body $createEventData -UseAuth $false
                Write-Host "Create Analytics Event:" ($createAnalyticsEventResult -ne $null)
                
                $getAnalyticsSessionsResult = Invoke-ApiRequest -Method "GET" -Endpoint "/analytics" -UseAuth $true
                Write-Host "Get Analytics Sessions:" ($getAnalyticsSessionsResult -ne $null)
                
                $getAnalyticsSessionDetailsResult = Invoke-ApiRequest -Method "GET" -Endpoint "/analytics/$sessionId" -UseAuth $true
                Write-Host "Get Analytics Session Details:" ($getAnalyticsSessionDetailsResult -ne $null)
            }
            
            # Probar endpoints de administración
            Write-Host "`nProbando Admin Endpoints..." -ForegroundColor Yellow
            
            $addModeratorResult = Invoke-ApiRequest -Method "POST" -Endpoint "/admin/company/$companyId/user/25535866-9" -UseAuth $true
            Write-Host "Add Moderator to Company:" ($addModeratorResult -ne $null)
            
            $addAdminResult = Invoke-ApiRequest -Method "POST" -Endpoint "/admin/user/25535866-9" -UseAuth $true
            Write-Host "Add Admin Role to User:" ($addAdminResult -ne $null)
            
            $getCompanyModeratorsResult = Invoke-ApiRequest -Method "GET" -Endpoint "/admin/company/$companyId/users" -UseAuth $true
            Write-Host "Get Company Moderators:" ($getCompanyModeratorsResult -ne $null)
            
            $getAdminsResult = Invoke-ApiRequest -Method "GET" -Endpoint "/admin/users" -UseAuth $true
            Write-Host "Get Admins:" ($getAdminsResult -ne $null)
        }
    }
}
finally {
    # Detener Docker Compose
    Write-Host "`nDeteniendo Docker Compose..." -ForegroundColor Green
    docker-compose down
}

Write-Host "`nPruebas completadas!" -ForegroundColor Green 