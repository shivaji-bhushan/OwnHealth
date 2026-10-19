@echo off
set ComSpec=%SystemRoot%\system32\cmd.exe
echo ========================================================
echo Starting Own Health Web3 AI Healthcare Platform...
echo URL: http://localhost:3000
echo ========================================================
node node_modules\next\dist\bin\next dev -p 3000
pause
