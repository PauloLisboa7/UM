@echo off
echo ========================================
echo   INICIAR SERVIDOR LOCAL - PROJETO UM
echo ========================================
echo.

REM Obter IP local
echo Obtendo endereco IP local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set IP=%%a
    goto :ip_found
)
:ip_found
set IP=%IP: =%
echo.
echo ========================================
echo   SEU IP LOCAL: %IP%
echo ========================================
echo.

REM Iniciar backend
echo [1/2] Iniciando servidor backend (porta 5000)...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak >nul

REM Iniciar frontend
echo [2/2] Iniciando servidor frontend (porta 3000)...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   SERVIDORES INICIADOS COM SUCESSO!
echo ========================================
echo.
echo Backend:  http://%IP%:5000
echo Frontend: http://%IP%:3000
echo.
echo Outros dispositivos na mesma rede podem acessar usando:
echo   http://%IP%:3000
echo.
echo Pressione qualquer tecla para fechar esta janela...
echo (Os servidores continuarao rodando nas outras janelas)
pause >nul
