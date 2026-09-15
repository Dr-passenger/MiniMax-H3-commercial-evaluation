@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if not errorlevel 1 goto launch
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.mjs
  goto done
)
echo Node.js 18+ is required. Please install Node.js and try again.
pause
exit /b 1
:launch
node server.mjs
:done
if errorlevel 1 pause
