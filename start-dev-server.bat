@echo off
title Next.js Development Server
echo ==================================================
echo Starting your Development Server...
echo ==================================================
echo.

cd /d "c:\Users\ACER\Desktop\isoftware\isoftwareacademy"

echo [1/2] Running cleanup script...
node fix-middleware.js
echo.

echo [2/2] Starting Next.js...
npm run dev

echo.
echo ==================================================
echo ❌ THE SERVER HAS CRASHED! 
echo ==================================================
echo Please take a screenshot of this entire black window 
echo and send it to me, or copy the error text above.
echo ==================================================
pause
