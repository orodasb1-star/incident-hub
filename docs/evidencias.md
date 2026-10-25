# Evidencias del proceso

Todo se puede reconstruir desde Azure DevOps y los repositorios; esta tabla solo indica dónde mirar.

| Requisito | Dónde verlo | Enlace / referencia |
|---|---|---|
| Backlog (2 Epics, 5 Features, 11 User Stories, 25 Tasks) | Azure Boards → Backlogs / Boards | *(pegar URL)* |
| Ramas `feature/*`, `fix/*`, `refactor/*`, `chore/*` | Azure Repos → Branches | |
| Commits con `AB#ID` | Azure Repos → Commits / pestaña *Development* de cada Work Item | |
| 10 Pull Requests con descripción, revisión y build | Azure Repos → Pull requests → *Completed* | PR1 … PR10 |
| Política de rama en `main` | Repos → Branches → main → Branch policies | |
| Pipeline fallido | Pipelines → run de PR4 (error `Could not resolve a module for a custom reporter`) | *(URL del run)* |
| Diagnóstico y corrección | Task "Corregir pipeline", rama `fix/pipeline-junit`, PR5 | |
| Pipeline exitoso | Pipelines → run posterior a PR5 | *(URL del run)* |
| Agente autohospedado | Organization settings → Agent pools → SelfHosted (Online) y log *Initialize job* | |
| Secretos protegidos | Pipelines → Library → `incident-hub-secrets` (candado) | |
| Artefacto | Run → *Related* → Published artifact `incident-hub` | |
| GitHub Actions | GitHub → Actions → workflow *CI - GitHub Actions* | *(URL)* |
| Dependencias | `docs/dependencias.md` + paso de auditoría en pipeline | |
| Deuda técnica (5+ identificadas, 2 resueltas) | `docs/deuda-tecnica.md`, PR7, PR8 | |
| Versiones v0.1.0 → v1.0.0 | Repos → Tags / GitHub → Releases | |
| Release con ambientes y aprobación | Pipelines → Environments → `incident-hub-qa`, `incident-hub-prod` (historial de aprobaciones) | |
