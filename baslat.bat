@echo off
echo Balci Jant Lastik Uygulamasi Baslatiliyor...
echo Lutfen bu pencereyi kapatmayin! Uygulamanin Excel'i okumasi icin acik kalmali.
echo =========================================================

REM Python yüklü mü kontrol et
python --version >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo Python bulundu. Web sunucusu baslatiliyor...
    start http://localhost:8000
    python -m http.server 8000
    pause
    exit
)

REM PHP yüklü mü kontrol et
php -v >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo PHP bulundu. Web sunucusu baslatiliyor...
    start http://localhost:8000
    php -S localhost:8000
    pause
    exit
)

REM Node.js npx yüklü mü kontrol et
npx -v >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo Node.js bulundu. Web sunucusu baslatiliyor...
    npx serve .
    pause
    exit
)

echo.
echo HATA: Bilgisayarinizda Python, PHP veya Node.js kurulu degil.
echo Excel'in otomatik okunabilmesi icin bunlardan birinin kurulu olmasi veya
echo bu klasoru bir web tarayicisi eklentisi (ornegin VS Code Live Server)
echo araciligiyla calistirmaniz gerekmektedir.
echo.
pause
