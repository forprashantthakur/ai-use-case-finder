# Run from the repository root. Opens two terminals: FastAPI (8001) + Vite (5173).
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Write-Host "Starting AI Use Case Finder (backend + frontend)…" -ForegroundColor Cyan
Write-Host "  API:    http://127.0.0.1:8001/api/health" -ForegroundColor Gray
Write-Host "  App:    http://localhost:5173" -ForegroundColor Gray
Write-Host "  Ollama: must be running; try: ollama pull llama3.2" -ForegroundColor Gray
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$root\backend'; .\start-backend.ps1"
)
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$root\frontend'; npm run dev"
)
