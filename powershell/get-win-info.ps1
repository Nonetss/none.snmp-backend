$endpoint = "http://localhost:3000/api/v0/win-info"

# 1. Aplicaciones instaladas
$installedApps = Get-ItemProperty `
    HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*,
    HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* `
    | Where-Object { $_.DisplayName } `
    | Select-Object DisplayName, DisplayVersion, Publisher, InstallDate

# 2. Información de Red
$networkInfo = Get-CimInstance Win32_NetworkAdapterConfiguration |
    Where-Object { $_.IPEnabled } |
    Select-Object Description, MACAddress, @{ Name = "IPAddress"; Expression = { $_.IPAddress } }

# --- NUEVA SECCIÓN: Servicios en ejecución ---
$runningServices = Get-CimInstance Win32_Service -Filter "State = 'Running'" | 
    Select-Object Name, DisplayName, State, StartMode
# ---------------------------------------------

# 3. Construcción del objeto de datos
$data = @{
    ComputerSystem        = Get-CimInstance Win32_ComputerSystem | Select-Object Name, Domain, Manufacturer, Model, TotalPhysicalMemory
    OperatingSystem       = Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, OSArchitecture, InstallDate
    BIOS                  = Get-CimInstance Win32_BIOS | Select-Object Manufacturer, SMBIOSBIOSVersion, SerialNumber
    BaseBoard             = Get-CimInstance Win32_BaseBoard | Select-Object Product, Manufacturer, SerialNumber
    Processor             = Get-CimInstance Win32_Processor | Select-Object Name, MaxClockSpeed, NumberOfCores
    PhysicalMemory        = Get-CimInstance Win32_PhysicalMemory | Select-Object Capacity, Speed, DeviceLocator
    DiskDrive             = Get-CimInstance Win32_DiskDrive | Select-Object Model, Size, DeviceID
    ComputerSystemProduct = Get-CimInstance Win32_ComputerSystemProduct | Select-Object IdentifyingNumber, Name, Vendor
    InstalledApplications = $installedApps
    NetworkIdentity       = $networkInfo
    NetworkAdapterConfig  = Get-CimInstance Win32_NetworkAdapterConfiguration | Select-Object ServiceName, DHCPEnabled, Description, Index
    RunningServices       = $runningServices
}

# 4. Conversión a JSON
$json = $data | ConvertTo-Json -Depth 4 -Compress

# 5. Envío a la API
try {
    Invoke-WebRequest `
        -Uri $endpoint `
        -Method Post `
        -ContentType "application/json; charset=utf-8" `
        -Body $json `
        -TimeoutSec 10 `
        -UseBasicParsing | Out-Null
    Write-Host "Datos (incluyendo servicios) enviados con éxito." -ForegroundColor Green
}
catch {
    Write-Error "Error al enviar los datos: $_"
}