# Agente autohospedado (self-hosted agent)

El pipeline corre en el pool **SelfHosted**, con un agente instalado en la PC del equipo.

## Requisitos de la PC
- Windows 10/11 de 64 bits, encendida y con internet mientras corre el pipeline.
- Git instalado (`git --version`).
- Node.js 20 instalado (`node -v`) — el pipeline igual lo instala con `NodeTool@0`.

## Instalación (resumen)
1. Azure DevOps → *Organization settings* → *Agent pools* → **Add pool** → *Self-hosted*, nombre `SelfHosted`,
   marcar *Grant access permission to all pipelines*.
2. Crear un **Personal Access Token** (PAT) con alcance *Agent Pools (Read & manage)*. El PAT **no** se guarda
   en el repositorio ni en documentos.
3. Abrir el pool → **New agent** → Windows → *Download*. Descomprimir en `C:\agents\incident-hub`.
4. En un **Símbolo del sistema (cmd)** dentro de esa carpeta ejecutar `devops\configurar-agente.cmd`
   (o directamente `config.cmd`) y responder:
   - Server URL: `https://dev.azure.com/<organizacion>`
   - Authentication type: `PAT` → pegar el token
   - Agent pool: `SelfHosted`
   - Agent name: `PC-<nombre>`
   - Run as service: `N` (más simple) y luego ejecutar `run.cmd`
5. En el pool, pestaña **Agents**, el agente debe verse **Online**.

## Evidencia
- Captura del pool con el agente *Online*.
- En el log de cualquier ejecución, paso *Initialize job*: `Agent name: PC-...` y `Agent machine name`.
