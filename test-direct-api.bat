@echo off
setlocal enabledelayedexpansion

echo.
echo ==============================
echo TESTE DIRETO DA API
echo ==============================
echo.

echo [1] Testando conexão com backend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/register' -Method OPTIONS -UseBasicParsing -ErrorAction Stop; Write-Host '✅ Backend respondendo!' } catch { Write-Host '❌ Backend não respondeu:', $_.Exception.Message }"

echo.
echo [2] Tentando registrar usuário...
powershell -Command ^
  "$body = @{ username='vini7'; email='tasaka343@gmail.com'; password='teste123' } | ConvertTo-Json; " ^
  "Write-Host 'Body:' $body; " ^
  "try { " ^
  "  $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/register' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing -ErrorAction Stop; " ^
  "  Write-Host '✅ Status:' $response.StatusCode; " ^
  "  Write-Host 'Resposta:' $response.Content; " ^
  "} catch { " ^
  "  Write-Host '❌ Status:' $_.Exception.Response.StatusCode.Value; " ^
  "  Write-Host 'Erro:' $_.Exception.Message; " ^
  "  try { " ^
  "    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); " ^
  "    $responseBody = $reader.ReadToEnd(); " ^
  "    Write-Host 'Response Body:' $responseBody; " ^
  "  } catch { } " ^
  "}"

echo.
echo ==============================
pause
