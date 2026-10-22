@echo off
REM Configura el agente autohospedado de Azure Pipelines.
REM Ejecutar desde la carpeta donde se descomprimio el agente (ej. C:\agents\incident-hub).
REM El PAT se solicita de forma interactiva: NUNCA lo escribas en este archivo.

if not exist config.cmd (
  echo No se encontro config.cmd. Ejecuta este script dentro de la carpeta del agente.
  exit /b 1
)

set /p ORG=Nombre de tu organizacion de Azure DevOps (lo que va despues de dev.azure.com/):
set /p AGENTE=Nombre del agente (ej. PC-OMAR):

call config.cmd --url https://dev.azure.com/%ORG% --auth pat --pool SelfHosted --agent %AGENTE% --acceptTeeEula
if errorlevel 1 exit /b 1

echo.
echo Agente configurado. Iniciando... (deja esta ventana abierta mientras uses el pipeline)
call run.cmd
