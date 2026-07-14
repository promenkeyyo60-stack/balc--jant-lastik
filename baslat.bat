@echo off
echo Balci Jant Lastik Uygulamasi Baslatiliyor...
echo Lutfen bu pencereyi kapatmayin! Uygulamanin Excel'i okumasi icin acik kalmali.
echo =========================================================

REM Node.js yuklu mu kontrol et (ilk secenek)
node -v >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo Node.js bulundu. Web sunucusu baslatiliyor...
    start http://localhost:8080
    node server.js
    pause
    exit
)

REM Python yuklu mu kontrol et (ikinci secenek)
python --version >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo Python bulundu. Web sunucusu baslatiliyor...
    start http://localhost:8000
    python -m http.server 8000
    pause
    exit
)

REM PHP yuklu mu kontrol et (ucuncu secenek)
php -v >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo PHP bulundu. Web sunucusu baslatiliyor...
    start http://localhost:8000
    php -S localhost:8000
    pause
    exit
)

echo.
echo HATA: Bilgisayarinizda Node.js, Python veya PHP kurulu degil!
echo Gorsellerin ve verilerin yuklenebilmesi icin Node.js yuklemelisiniz.
echo https://nodejs.org/ adresinden indirip kurabilirsiniz.
echo.
pause
