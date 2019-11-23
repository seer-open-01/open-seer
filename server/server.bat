@echo off
cls
title Server Operation
:menu
cls
color 0B
echo.
echo       ----------------------------
echo       ----------- Server Operation
echo       ----------------------------
echo.
echo        1. Start All Server
echo.
echo        2. Close All Server
echo.

set /p choice=

if /i "%choice%"=="1" goto open
goto close

:open
call node Middle.js
call node Game8002.js
call node Game8300.js
goto end
:close
taskkill /f /IM node.exe
:end
