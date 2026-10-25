# IT Incident Hub

Sistema web para registrar, asignar y dar seguimiento a incidentes de TI, construido con un flujo DevOps
completo: Azure Boards → rama → commit `AB#ID` → Pull Request → pipeline → artefacto → release.

**Versión actual:** 1.0.0 — ver [CHANGELOG](CHANGELOG.md).

## Enlaces del proyecto
- Azure DevOps: `https://dev.azure.com/devopsOrganizacionUMG/IT-Incident-Hub`
- GitHub (espejo + Actions): `https://github.com/orodasb1-star/incident-hub`

## Funcionalidades
- Registro y consulta de incidentes (título, descripción, categoría, prioridad, usuario, fecha, estado).
- Asignación de técnico y flujo de estados `NUEVO → ASIGNADO → EN_PROCESO → RESUELTO → CERRADO`.
- Bitácora de comentarios por incidente.
- Filtros por estado, prioridad, categoría y técnico; paginación.
- Dashboard: abiertos, cerrados, críticos y distribución por categoría y técnico.

## Requisitos
- Node.js 20 o superior
- PostgreSQL 14 o superior (opcional en desarrollo: sin `DATABASE_URL` la API usa un repositorio en memoria)
- Git

## Instalación y ejecución

### 1. Base de datos (opcional)
```bash
createdb incident_hub
psql -d incident_hub -f database/schema.sql
psql -d incident_hub -f database/seed.sql
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env      # en Windows: copy .env.example .env  — editar DATABASE_URL (no se sube al repo)
npm start                 # http://localhost:3000/api/health
npm test                  # pruebas + cobertura
npm run lint
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173 (redirige /api a localhost:3000)
npm run build             # genera frontend/dist
```

### 4. Prueba de humo
```bash
node tests/smoke.js http://localhost:3000
```

## Estructura
```
backend/              API REST (Node.js + Express) y pruebas (Jest + Supertest)
frontend/             Interfaz web (React + Vite)
database/             schema.sql y seed.sql
tests/                Prueba de humo
devops/               Agente autohospedado y validación de despliegue
docs/                 Arquitectura, branching, deuda técnica, seguridad, dependencias, release
.github/workflows/    GitHub Actions
azure-pipelines.yml   CI/CD de Azure Pipelines (CI → QA → Producción)
```

## Documentación
| Documento | Contenido |
|---|---|
| [arquitectura.md](docs/arquitectura.md) | Capas, modelo de datos, API |
| [branching.md](docs/branching.md) | Ramas, flujo de PR y políticas |
| [deuda-tecnica.md](docs/deuda-tecnica.md) | 7 deudas identificadas, 2 resueltas |
| [seguridad.md](docs/seguridad.md) | Secretos y controles |
| [dependencias.md](docs/dependencias.md) | Vulnerabilidades, severidad y decisiones |
| [release.md](docs/release.md) | SemVer, ambientes, aprobaciones y rollback |
| [evidencias.md](docs/evidencias.md) | Enlaces a la evidencia del proceso |

## Responsables

| Usuario | Rol |
|---|---|
| Omar Rodas | Desarrollo: Product Owner, backend, DevOps |
| Omar Rodas (QA) | QA: frontend, pruebas, seguridad, revisión y aprobación de Producción |

> Proyecto individual. La organización de Azure DevOps de la universidad no permite invitar usuarios; los roles se
> distinguen por la identidad de Git de los commits (ver `docs/branching.md`).
