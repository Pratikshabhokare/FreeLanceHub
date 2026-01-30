@echo off
echo Starting FreeLanceHub Fullstack Project...

:: Database Reminder
echo IMPORTANT: Make sure you have created a MySQL database named 'freeLanceHub'
echo and that your MySQL server is running (User: root, Pass: root).
echo.

:: Start Backend
echo Starting Backend Server...
start "FreeLanceHub Backend" cmd /k "cd FreeLanceHub_Backend\FreeLanceHub && mvnw.cmd spring-boot:run"

:: Start Frontend
echo Starting Frontend Client...
start "FreeLanceHub Frontend" cmd /k "cd FreeLanceHub_Frontend && npm install && npm run dev"

echo.
echo Servers are launching in separate windows.
echo Backend will be at: http://localhost:8082
echo Frontend will be at: http://localhost:5173
echo.
pause
