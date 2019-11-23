@echo off

echo ----------------------------------------------------
echo 清理编译发布文件
echo 当前文件目录：%~dp0
echo ----------------------------------------------------
#pause

echo 删除publish
del /F /Q /S %~dp0publish\*.*
rd  /Q /S %~dp0publish
echo ----------------------------------------------------

echo 删除src_sign
del /F /Q /S %~dp0src_sign\*.*
rd  /Q /S %~dp0src_sign
echo ----------------------------------------------------

echo 删除simulator
del /F /Q /S %~dp0simulator\*.*
rd  /Q /S %~dp0simulator
echo ----------------------------------------------------

echo 删除编译资源
del /F /Q /S %~dp0frameworks\runtime-src\proj.android-studio\app\assets\*.*
rd  /Q /S %~dp0frameworks\runtime-src\proj.android-studio\app\assets
echo ----------------------------------------------------

pause
