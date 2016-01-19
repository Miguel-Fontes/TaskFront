SET NODE=.\..\bin\node.exe

SET HTTP=.\node_modules\http-server\bin\http-server

%node% %http% .\ -a localhost -p 8000 -c-1

pause