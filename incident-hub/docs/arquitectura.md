# Arquitectura

## Vista general

```
Usuario ──► Frontend (React + Vite) ──HTTP/JSON──► API REST (Node.js + Express) ──► PostgreSQL
                                                         │
                                                         └─► Repositorio en memoria (pruebas / sin BD)
```

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Frontend | React 18 + Vite | Registro, consulta con filtros, detalle (asignar, estado, bitácora) y dashboard |
| API | Node.js 20 + Express 4 | Reglas de negocio, validaciones, transiciones de estado |
| Persistencia | PostgreSQL 14+ (`pg`) | Tablas `tecnicos`, `incidentes`, `comentarios` |
| Pruebas | Jest + Supertest | Pruebas de API sobre el repositorio en memoria |

## Decisiones de diseño
- **Patrón repositorio**: `crearApp(repo)` recibe la capa de datos. En producción se usa `pgRepo` (PostgreSQL)
  y en pruebas `memoryRepo`, así las pruebas no necesitan base de datos y corren en cualquier agente de CI.
- **Máquina de estados**: las transiciones permitidas están centralizadas en `backend/src/constants.js`:
  `NUEVO → ASIGNADO → EN_PROCESO → RESUELTO → CERRADO` (y `RESUELTO → EN_PROCESO` para reabrir).
- **Configuración por entorno**: `DATABASE_URL` y `PORT` vienen de variables de entorno, nunca del código.

## Modelo de datos

| Tabla | Campos principales |
|---|---|
| `tecnicos` | id, nombre |
| `incidentes` | id, titulo, descripcion, categoria, prioridad, usuario, estado, tecnico_id, fecha |
| `comentarios` | id, incidente_id, autor, texto, fecha |

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servicio |
| POST | `/api/incidentes` | Crear incidente |
| GET | `/api/incidentes?estado=&prioridad=&categoria=&tecnicoId=` | Consultar con filtros |
| GET | `/api/incidentes/:id` | Detalle |
| PATCH | `/api/incidentes/:id/asignar` | Asignar técnico |
| PATCH | `/api/incidentes/:id/estado` | Cambiar estado |
| POST/GET | `/api/incidentes/:id/comentarios` | Bitácora |
| GET | `/api/tecnicos` | Catálogo de técnicos |
| GET | `/api/dashboard` | Indicadores |
