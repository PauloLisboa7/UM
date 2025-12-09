@echo off
setlocal enabledelayedexpansion

REM Generate timestamp for unique test user
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set timestamp=!mydate!!mytime!

echo.
echo ==============================
echo TESTANDO CADASTRO SUPABASE
echo ==============================
echo.

set "username=testuser_!timestamp!"
set "email=test_!timestamp!@example.com"
set "password=senha123"

echo [ENVIANDO REQUEST]
echo POST http://localhost:5000/api/auth/register
echo Body:
echo {
echo   "username": "!username!",
echo   "email": "!email!",
echo   "password": "!password!"
echo }
echo.

powershell -Command ^
  "$body = @{ username='!username!'; email='!email!'; password='!password!' } | ConvertTo-Json; " ^
  "try { " ^
  "  $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/register' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing -ErrorAction Stop; " ^
  "  Write-Host '✅ SUCESSO! Status:' $response.StatusCode; " ^
  "  Write-Host 'Resposta JSON:'; " ^
  "  Write-Host $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10; " ^
  "} catch { " ^
  "  Write-Host '❌ ERRO:' $_.Exception.Message; " ^
  "}"

echo.
echo ==============================
echo [TESTANDO LOGIN]
echo POST http://localhost:5000/api/auth/login
echo Body:
echo {
echo   "username": "!username!",
echo   "password": "!password!"
echo }
echo.

powershell -Command ^
  "$body = @{ username='!username!'; password='!password!' } | ConvertTo-Json; " ^
  "try { " ^
  "  $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing -ErrorAction Stop; " ^
  "  Write-Host '✅ SUCESSO! Status:' $response.StatusCode; " ^
  "  Write-Host 'Resposta JSON:'; " ^
  "  Write-Host $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10; " ^
  "} catch { " ^
  "  Write-Host '❌ ERRO:' $_.Exception.Message; " ^
  "}"

echo.
echo ==============================
echo Teste concluido!
echo ==============================
pause
