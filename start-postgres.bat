@echo off
echo ================================
echo Starting PostgreSQL with Docker
echo ================================
echo.

echo Checking if barberly-postgres container exists...
docker ps -a --filter "name=barberly-postgres" --format "{{.Names}}" | findstr /c:"barberly-postgres" >nul 2>&1

if %errorlevel% equ 0 (
    echo Container exists. Starting it...
    docker start barberly-postgres
    echo.
    echo ✅ PostgreSQL container started!
) else (
    echo Container doesn't exist. Creating new PostgreSQL container...
    docker run --name barberly-postgres -e POSTGRES_DB=barberly_db -e POSTGRES_USER=barberly_user -e POSTGRES_PASSWORD=barberly_password_2024 -p 5432:5432 -d postgres:14
    echo.
    echo ✅ PostgreSQL container created and started!
)

echo.
echo 📊 Database Details:
echo    Host: localhost
echo    Port: 5432
echo    Database: barberly_db
echo    Username: barberly_user
echo    Password: barberly_password_2024
echo.
echo 🔗 Connection URL:
echo    postgresql://barberly_user:barberly_password_2024@localhost:5432/barberly_db
echo.
echo ================================
pause
