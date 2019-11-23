@echo off

echo ----------------------------------------------------
echo 清理win32 Debug文件
echo 当前文件目录：%~dp0
echo ----------------------------------------------------
pause

echo 删除js-bindings
del /F /Q /S %~dp0frameworks\cocos2d-x\cocos\scripting\js-bindings\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\cocos\scripting\js-bindings\proj.win32\Debug.win32
echo ----------------------------------------------------

echo 删除spine
del /F /Q /S %~dp0frameworks\cocos2d-x\cocos\editor-support\spine\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\cocos\editor-support\spine\proj.win32\Debug.win32
echo ----------------------------------------------------

echo 删除Box2D
del /F /Q /S %~dp0frameworks\cocos2d-x\external\Box2D\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\external\Box2D\proj.win32\Debug.win32
echo ----------------------------------------------------

echo 删除bullet
del /F /Q /S %~dp0frameworks\cocos2d-x\external\bullet\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\external\bullet\proj.win32\Debug.win32
echo ----------------------------------------------------

echo 删除recast
del /F /Q /S %~dp0frameworks\cocos2d-x\external\recast\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\external\recast\proj.win32\Debug.win32
echo ----------------------------------------------------

echo 删除2d
del /F /Q /S %~dp0frameworks\cocos2d-x\cocos\2d\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\cocos\2d\Debug.win32
echo ----------------------------------------------------

echo 删除Debug
del /F /Q /S %~dp0frameworks\runtime-src\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\runtime-src\proj.win32\Debug.win32\
echo ----------------------------------------------------

pause
