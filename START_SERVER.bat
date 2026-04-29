@echo off
echo Iniciando Illinois Hub...

echo Tentativa 1: Node do sistema
node server.js
if %ERRORLEVEL% EQU 0 goto end

echo Tentativa 2: Fallback Playwright
"C:\Users\Guilherme Suzuki\AppData\Local\ms-playwright-go\1.57.0\node.exe" server.js
if %ERRORLEVEL% EQU 0 goto end

echo.
echo ERRO: Node.js nao foi encontrado.
pause

:end
pause
