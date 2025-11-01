@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Navigate relative to the script location
set ROOT=%~dp0

REM Start Back (API) in a new terminal window
start "Back" cmd /k "cd /d \"%ROOT%Back\" && npm run dev"

REM Start Front (Web) in a new terminal window
start "Front" cmd /k "cd /d \"%ROOT%Front\" && npm run dev"

echo Both Front and Back are starting in separate terminals...
endlocal
