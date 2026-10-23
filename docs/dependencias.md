# Análisis de dependencias

Herramienta: `npm audit` (base de datos de GitHub Advisories). Fecha del análisis: 23/10/2026.

## Dependencias directas

| Paquete | Versión | Tipo | Uso |
|---|---|---|---|
| express | ^4.19.2 | producción | Servidor HTTP / API REST |
| cors | ^2.8.5 | producción | Permitir llamadas del frontend |
| pg | ^8.12.0 | producción | Cliente PostgreSQL |
| react / react-dom | 18.3.1 | producción (frontend) | Interfaz |
| jest, supertest, jest-junit | 29.7 / 7.x / 16 | desarrollo | Pruebas |
| eslint | ^8.57.0 | desarrollo | Lint |
| vite, @vitejs/plugin-react | 5.4.11 → **6.4.4** / 4.3.4 | desarrollo (frontend) | Compilación |

## Resultados

| # | Paquete | Severidad | Alcance | Hallazgo | Decisión |
|---|---|---|---|---|---|
| 1 | vite 5.4.11 (frontend) | **Alta** | Desarrollo | Varias vulnerabilidades del servidor de desarrollo: *bypass* de `server.fs.deny`, path traversal, lectura de respuestas desde otros sitios (GHSA-vg6x-rcgg-rjx6, GHSA-4w7w-66w2-5vf9, entre otras) | **Corregir**: actualizar a vite 6.4.4. Se probó `npm run build` sin cambios de código. Resultado: 0 vulnerabilidades en frontend. |
| 2 | esbuild ≤0.24.2 (vía vite) | Moderada | Desarrollo | El servidor de desarrollo acepta peticiones de cualquier sitio (GHSA-67mh-4wv8-2f99) | **Corregido** con la misma actualización de vite. |
| 3 | jest 29 y su árbol (micromatch, braces, @jest/*) | **Alta** | Solo desarrollo | Denegación de servicio por expresiones/patrones (GHSA-vfj7-8cjw-p6xm, entre otras) | **Aceptar temporalmente**: no se incluye en el artefacto ni corre en producción; la corrección exige jest 30 (cambio mayor). Registrado como deuda técnica DT-06. |
| 4 | sprintf-js / argparse / js-yaml (vía jest) | Moderada | Solo desarrollo | DoS por especificadores de precisión (GHSA-hp3w-g68c-fv3c) | **Aceptar temporalmente**, mismo motivo que #3. |
| 5 | express, cors, pg | — | Producción | `npm audit --omit=dev`: **0 vulnerabilidades** | Mantener. |

## Política
- El pipeline **falla** si hay vulnerabilidades *high* o *critical* en dependencias de **producción**.
- Las de desarrollo se revisan en cada análisis y se documentan aquí con su decisión.

## Cómo repetir el análisis
```bash
cd backend  && npm audit && npm audit --omit=dev
cd frontend && npm audit && npm audit --omit=dev
```
