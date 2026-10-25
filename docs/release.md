# Estrategia de release

## Versionado (Semantic Versioning)
`MAYOR.MENOR.PARCHE` — MAYOR: cambios incompatibles · MENOR: funcionalidad nueva compatible · PARCHE: correcciones.
Antes de 1.0.0 la API se considera en desarrollo. Las versiones se marcan con **tags anotados** en Git (`vX.Y.Z`).

| Versión | Contenido | PR |
|---|---|---|
| v0.1.0 | Esquema de BD y API (crear, consultar, filtros, asignar, estados, bitácora, dashboard) | PR1, PR2 |
| v0.2.0 | Frontend React + pipeline CI con agente autohospedado (fallo controlado y corrección) | PR3, PR4, PR5 |
| v0.3.0 | GitHub Actions, análisis y actualización de dependencias | PR6 |
| v0.4.0 | Pago de deuda técnica: paginación (DT-02) y manejo de errores/logging (DT-05) | PR7, PR8 |
| v1.0.0-rc.1 | Release candidate: ambientes QA/Producción con aprobación | PR9 |
| v1.0.0 | Primera versión estable | PR10 |

## Ambientes

| Ambiente | Azure DevOps Environment | Cuándo se despliega | Control |
|---|---|---|---|
| Desarrollo | (local) | Cada desarrollador en su PC | Pruebas locales |
| CI | Stage `CI` | Todo push a `main`, `feature/*`, `fix/*`, `refactor/*`, `chore/*` | Lint, pruebas, auditoría de dependencias, artefacto |
| QA | `incident-hub-qa` | Merge a `main` y tags `v*` | Automático + prueba de humo sobre el artefacto |
| Producción | `incident-hub-prod` | Solo tags `v*` | **Aprobación manual** del revisor + prueba de humo |

## Flujo de liberación
1. Todo el trabajo entra a `main` por PR revisado y con build verde (política de rama).
2. Cada merge a `main` genera un artefacto `incident-hub-<build>.zip` y se despliega a **QA**.
3. Para liberar se crea un tag `vX.Y.Z` sobre `main` y se hace push del tag.
4. El pipeline vuelve a construir, despliega a QA y se detiene en **Producción** esperando la aprobación.
5. El aprobador (rol QA) revisa el resultado de QA y aprueba o rechaza. Con `v1.0.0-rc.1` la aprobación se **rechazó**
   a propósito para demostrar el control; con `v1.0.0` se aprobó.
6. Se publica el *Release* en GitHub con el CHANGELOG.

## Rollback
El artefacto de cada versión queda guardado en Azure Pipelines. Para volver atrás se re-ejecuta la etapa de
Producción del run de la versión anterior (*Rerun stage*) o se crea un tag de parche `vX.Y.(Z+1)` con la reversión.
