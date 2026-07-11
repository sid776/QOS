# Start QuantumOS locally (API + Dashboard)
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$env:PYTHONPATH = $Root
$env:DATABASE_URL = "sqlite:///$Root/quantumos_local.db"

Write-Host "Starting QuantumOS API on http://127.0.0.1:8000 ..." -ForegroundColor Cyan
Start-Process -FilePath "$Root\.venv2\Scripts\uvicorn.exe" `
  -ArgumentList "apps.api.quantumos_api.main:app","--host","127.0.0.1","--port","8000" `
  -WorkingDirectory $Root -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Starting Dashboard on http://127.0.0.1:5173 ..." -ForegroundColor Cyan
Set-Location "$Root\apps\dashboard"
$env:VITE_API_URL = "http://127.0.0.1:8000"
Start-Process -FilePath "npm" -ArgumentList "run","dev","--","--host","127.0.0.1","--port","5173" `
  -WorkingDirectory "$Root\apps\dashboard" -WindowStyle Minimized

Start-Sleep -Seconds 4

Write-Host ""
Write-Host "QuantumOS is running!" -ForegroundColor Green
Write-Host "  Beginner guide:  http://127.0.0.1:5173/guide"
Write-Host "  Use cases:       http://127.0.0.1:5173/use-cases"
Write-Host "  API health:      http://127.0.0.1:8000/health"
Write-Host ""
