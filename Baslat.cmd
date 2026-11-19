@echo off
rem Starts the Salon 3B app on this computer and opens it in the browser.
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js bulunamadi. https://nodejs.org adresinden kurun. & pause & exit /b 1)
title Salon 3B
node server.js
pause
