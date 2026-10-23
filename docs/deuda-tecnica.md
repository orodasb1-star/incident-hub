# Deuda técnica

Cada deuda está registrada en Azure Boards como Task con la etiqueta `deuda-tecnica` (User Story "US11 Reducir
deuda técnica"). Las resueltas se trabajaron con rama `refactor/*`, commit `AB#ID` y Pull Request.

| ID | Deuda | Impacto | Prioridad | Estado | Trazabilidad |
|---|---|---|---|---|---|
| DT-01 | La API no tiene autenticación ni autorización: cualquiera puede crear, asignar o cerrar incidentes | Seguridad | Alta | Pendiente (planificada post v1.0.0) | AB#127 |
| DT-02 | `GET /api/incidentes` devuelve todos los registros sin paginación | Rendimiento con muchos incidentes | Media | **Resuelta** | AB#128 · `refactor/deuda-paginacion` · PR7 |
| DT-03 | Sin migraciones versionadas: el esquema solo existe en `schema.sql` | Cambios de BD no trazables entre ambientes | Media | Pendiente | AB#129 |
| DT-04 | No hay historial automático de cambios de estado (solo comentarios manuales) | Auditoría incompleta | Media | Pendiente | AB#130 |
| DT-05 | Manejo de errores genérico: JSON mal formado o ids inválidos devuelven 500, y no hay logging estructurado | Diagnóstico difícil, respuestas incorrectas | Alta | **Resuelta** | AB#131 · `refactor/deuda-errores-logging` · PR8 |
| DT-06 | Dependencias de desarrollo (árbol de jest 29) con vulnerabilidades altas; la corrección requiere jest 30 | Riesgo en estaciones de desarrollo/CI | Baja | Aceptada temporalmente (ver `dependencias.md`) | AB#132 |
| DT-07 | `pgRepo` devuelve comentarios con `incidente_id` y `memoryRepo` con `incidenteId` (contratos distintos) | Inconsistencia entre ambientes | Baja | Pendiente | AB#133 |

## DT-02 — Paginación (resuelta)
- **Cambio**: `GET /api/incidentes?page=&limit=` (por defecto 50, máximo 100). Responde el mismo arreglo de
  siempre (compatible con el frontend) y agrega los headers `X-Total-Count`, `X-Page` y `X-Limit`.
- **PostgreSQL**: `LIMIT/OFFSET` parametrizados + `COUNT(*)` con los mismos filtros.
- **Pruebas**: `backend/tests/paginacion.test.js` (3 casos).

## DT-05 — Manejo de errores y logging (resuelta)
- **Antes**: un JSON mal formado o un id no numérico (en PostgreSQL) devolvía `500 Error interno` y solo se
  escribía `console.error(err)`.
- **Cambio**:
  - `src/errorHandler.js`: manejo centralizado. JSON inválido → 400; errores de PostgreSQL `22P02`, `23502`,
    `23503`, `23514` → 400 con mensaje claro; el resto → 500 con `requestId`.
  - `src/logger.js`: log estructurado en JSON por petición (método, ruta, estado, duración, `requestId`) y header
    `X-Request-Id` en cada respuesta para rastrear errores.
  - Rutas inexistentes → 404 en JSON.
- **Pruebas**: `backend/tests/errores.test.js` (5 casos). Verificado también contra PostgreSQL real.
