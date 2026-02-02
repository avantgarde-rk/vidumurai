@echo off
title Vidumurai Launcher
echo ===========================================
echo    VIDUMURAI - SMART CAMPUS SYSTEM
echo ===========================================
echo.
echo [1/3] Starting Backend Server...
start "Vidumurai Backend (Port 5000)" cmd /k "cd server && npm run dev"
echo.

echo [2/3] Starting Frontend Client...
start "Vidumurai Frontend (Port 3000)" cmd /k "cd client && npm run dev"
echo.

echo [3/3] Opening Browser in 12 seconds (User Login)...
timeout /t 12 >nul
start http://localhost:3000

echo.
echo ===================================================
echo DONE!
echo If the page does not load, wait a few more seconds.
echo Login Credentials:
echo - Student: student@college.edu / password123
echo - Faculty: mentor@college.edu / password123
echo - HOD: hod@college.edu / password123
echo ===================================================
pause
