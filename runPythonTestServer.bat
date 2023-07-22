@ECHO OFF
cd /D "%~dp0"
echo Opening browser to localhost:8000...
start "" http://localhost:8000/
echo Starting Python 3 test server...
python -m http.server
pause