@echo off

echo ----------------------------------------------------
echo ������뷢���ļ�
echo ��ǰ�ļ�Ŀ¼��%~dp0
echo ----------------------------------------------------
#pause

echo ɾ��publish
del /F /Q /S %~dp0publish\*.*
rd  /Q /S %~dp0publish
echo ----------------------------------------------------

echo ɾ��src_sign
del /F /Q /S %~dp0src_sign\*.*
rd  /Q /S %~dp0src_sign
echo ----------------------------------------------------

echo ɾ��simulator
del /F /Q /S %~dp0simulator\*.*
rd  /Q /S %~dp0simulator
echo ----------------------------------------------------

echo ɾ��������Դ
del /F /Q /S %~dp0frameworks\runtime-src\proj.android-studio\app\assets\*.*
rd  /Q /S %~dp0frameworks\runtime-src\proj.android-studio\app\assets
echo ----------------------------------------------------

pause
