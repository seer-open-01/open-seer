@echo off

echo ----------------------------------------------------
echo ����win32 Debug�ļ�
echo ��ǰ�ļ�Ŀ¼��%~dp0
echo ----------------------------------------------------
pause

echo ɾ��js-bindings
del /F /Q /S %~dp0frameworks\cocos2d-x\cocos\scripting\js-bindings\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\cocos\scripting\js-bindings\proj.win32\Debug.win32
echo ----------------------------------------------------

echo ɾ��spine
del /F /Q /S %~dp0frameworks\cocos2d-x\cocos\editor-support\spine\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\cocos\editor-support\spine\proj.win32\Debug.win32
echo ----------------------------------------------------

echo ɾ��Box2D
del /F /Q /S %~dp0frameworks\cocos2d-x\external\Box2D\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\external\Box2D\proj.win32\Debug.win32
echo ----------------------------------------------------

echo ɾ��bullet
del /F /Q /S %~dp0frameworks\cocos2d-x\external\bullet\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\external\bullet\proj.win32\Debug.win32
echo ----------------------------------------------------

echo ɾ��recast
del /F /Q /S %~dp0frameworks\cocos2d-x\external\recast\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\external\recast\proj.win32\Debug.win32
echo ----------------------------------------------------

echo ɾ��2d
del /F /Q /S %~dp0frameworks\cocos2d-x\cocos\2d\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\cocos2d-x\cocos\2d\Debug.win32
echo ----------------------------------------------------

echo ɾ��Debug
del /F /Q /S %~dp0frameworks\runtime-src\proj.win32\Debug.win32\*.*
rd  /Q /S %~dp0frameworks\runtime-src\proj.win32\Debug.win32\
echo ----------------------------------------------------

pause
