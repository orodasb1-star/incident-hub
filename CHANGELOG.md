# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [SemVer](https://semver.org/lang/es/).

## [1.0.0] - 2026-10-25
### Agregado
- Primera versión estable de IT Incident Hub.

## [1.0.0-rc.1] - 2026-10-25
### Agregado
- Etapas de despliegue a QA y Producción con aprobación manual y prueba de humo sobre el artefacto.
- Documentación de estrategia de release y rollback.

## [0.4.0] - 2026-10-23
### Cambiado
- `GET /api/incidentes` paginado (`page`, `limit`, header `X-Total-Count`) — DT-02.
- Manejo centralizado de errores (JSON inválido y errores de PostgreSQL → 400) y logging estructurado con
  `X-Request-Id` — DT-05.

## [0.3.0] - 2026-10-23
### Agregado
- Workflow de GitHub Actions (lint, pruebas, build, auditoría y revisión de dependencias en PR).
### Seguridad
- Vite actualizado de 5.4.11 a 6.4.4 (vulnerabilidades altas del servidor de desarrollo).

## [0.2.0] - 2026-10-22
### Agregado
- Frontend React: registro, filtros, detalle con asignación, cambio de estado, bitácora y dashboard.
- Pipeline de Azure con agente autohospedado, pruebas, auditoría y artefacto.
### Corregido
- Pipeline fallaba por reporter `jest-junit` no instalado.

## [0.1.0] - 2026-10-21
### Agregado
- Esquema PostgreSQL y datos iniciales.
- API REST: crear/consultar incidentes con filtros, asignar técnico, transiciones de estado, bitácora, dashboard.
