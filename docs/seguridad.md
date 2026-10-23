# Seguridad y manejo de secretos

## Principio
Ninguna credencial, token o contraseña se guarda en el repositorio, en capturas ni en documentación.

## Qué es secreto en este proyecto

| Secreto | Dónde vive | Cómo se usa |
|---|---|---|
| `DATABASE_URL` (usuario/clave de PostgreSQL) | Azure DevOps → Pipelines → Library → Variable group `incident-hub-secrets` (marcada con candado) | Se inyecta como variable de entorno en las etapas de despliegue |
| PAT del agente autohospedado | Solo se escribe al configurar el agente; no se guarda | Registro del agente en el pool `SelfHosted` |
| Token de GitHub (si se usa push por HTTPS) | Administrador de credenciales de Windows | Push al espejo de GitHub |
| Secretos de GitHub Actions (si se necesitaran) | GitHub → Settings → Secrets and variables → Actions | `${{ secrets.NOMBRE }}` |

## Controles aplicados
- `.gitignore` excluye `.env`, `node_modules/`, `reports/`, `coverage/` y `dist/`.
- Se versiona solo `backend/.env.example` con valores de ejemplo.
- Las variables secretas de Azure Pipelines se enmascaran como `***` en los logs; el pipeline solo verifica que
  existan, nunca las imprime.
- La rama `main` está protegida: revisión obligatoria y build de validación.
- Auditoría automática de dependencias en Azure Pipelines y GitHub Actions (`npm audit --omit=dev --audit-level=high`)
  y `dependency-review-action` en cada PR de GitHub.
- Consultas a la base de datos parametrizadas (`$1, $2…`) en `pgRepo.js` para evitar inyección SQL.

## Pendientes (ver deuda técnica)
- La API no tiene autenticación ni autorización (DT-01).
