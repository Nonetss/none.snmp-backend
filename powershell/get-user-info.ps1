# Configuración del endpoint
$endpoint = "http://localhost:3000/api/v0/user/login"

# 1. Obtener información necesaria
$username = $env:USERNAME
$computerName = $env:COMPUTERNAME

# 2. Construcción del objeto de datos (debe coincidir con el JSON del curl)
$data = @{
    username     = $username
    computerName = $computerName
}

# 3. Conversión a JSON
$json = $data | ConvertTo-Json -Compress

# 4. Envío a la API de Login
try {
    $response = Invoke-WebRequest `
        -Uri $endpoint `
        -Method Post `
        -ContentType "application/json; charset=utf-8" `
        -Body $json `
        -UseBasicParsing

    Write-Host "Login exitoso para el usuario: $username" -ForegroundColor Green
    # Opcional: Mostrar la respuesta del servidor
    # Write-Host $response.Content
}
catch {
    Write-Error "Error al realizar el login: $_"
}