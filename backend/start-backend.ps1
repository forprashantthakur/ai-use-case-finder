# Uses port 8001 so this app does not clash with any old API still on 8000.
Set-Location $PSScriptRoot
Write-Host "Starting AI Use Case Finder API (Ollama) on http://127.0.0.1:8001" -ForegroundColor Cyan
Write-Host "Health: http://127.0.0.1:8001/api/health  (expect `"llm`": `"ollama`")" -ForegroundColor Gray
python -m uvicorn main:app --reload --port 8001
