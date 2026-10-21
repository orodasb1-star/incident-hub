# IT Incident Hub

Sistema web para registrar, asignar y dar seguimiento a incidentes de TI, construido con un flujo DevOps
completo: Azure Boards → rama → commit `AB#ID` → Pull Request → pipeline → artefacto → release.

> Estado: en desarrollo (estructura inicial). Ver `docs/plan-de-trabajo.md`.

## Estructura

```
incident-hub/
├── backend/              API REST (Node.js + Express)
├── frontend/             Interfaz web (React + Vite)
├── database/             Esquema y datos iniciales PostgreSQL
├── tests/                Pruebas de humo de la API
├── devops/               Scripts del agente autohospedado
├── docs/                 Documentación técnica
├── .github/workflows/    GitHub Actions
└── azure-pipelines.yml   Pipeline de Azure DevOps
```

## Responsables

| Usuario | Rol |
|---|---|
| Omar Rodas | Desarrollo: Product Owner, backend, DevOps |
| Omar Rodas (QA) | QA: frontend, pruebas, seguridad, revisión |

> Proyecto individual. La organización de Azure DevOps de la universidad no permite invitar usuarios; los roles se
> distinguen por la identidad de Git de los commits.
