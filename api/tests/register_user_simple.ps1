$jsonContent = Get-Content -Raw user_data_simple.json

try {
    $response = Invoke-RestMethod -Uri "https://localhost:44335/auth/register" -Method Post -Body $jsonContent -ContentType "application/json" -SkipCertificateCheck
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