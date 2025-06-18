$body = @{
  run = "12345678-9"
  firstNames = "Usuario"
  lastNames = "Prueba"
  email = "usuario.prueba@example.com"
  phone = "+56912345678"
  dirStreet1 = "Calle Principal"
  dirStreet2 = "Sector Centro"
  dirStNumber = "123"
  dirInNumber = "A"
  notify = $true
  passwordHash = "Contraseña123"
}

$bodyJson = $body | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://localhost:44335/auth/register" -Method Post -Body $bodyJson -ContentType "application/json" -SkipCertificateCheck
    Write-Output "Respuesta del servidor:"
    Write-Output $response
}
catch {
    Write-Output "Error al registrar usuario:"
    Write-Output $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        Write-Output $_.ErrorDetails.Message
    }
} 