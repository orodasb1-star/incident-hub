# Plan de trabajo — IT Incident Hub (21 al 25 de octubre)

Por instrucción del catedrático el proyecto se entrega en los días restantes y con **2 repositorios**:
Azure Repos (principal: PR, pipelines y trazabilidad con Boards) y GitHub (espejo: GitHub Actions).

## Reglas del equipo
- `main` siempre estable y protegida: solo entra código por Pull Request revisado.
- Ramas: `feature/*`, `fix/*`, `refactor/*`, `chore/*`.
- Todo commit relevante menciona su Work Item: `AB#<id>`.
- Ningún secreto en el repositorio (`.env` está en `.gitignore`).

## Cronograma

| Día | Foco | PR | Versión |
|---|---|---|---|
| 21 oct | Backlog, repos, estructura, esquema BD, API | PR1, PR2 | v0.1.0 |
| 22 oct | Frontend, self-hosted agent, pipeline (fallo y corrección) | PR3, PR4, PR5 | v0.2.0 |
| 23 oct | GitHub Actions, dependencias, seguridad, deuda técnica | PR6, PR7, PR8 | v0.3.0, v0.4.0 |
| 24 oct | Ambientes QA/Prod con aprobación, release candidate y v1.0.0 | PR9, PR10 | v1.0.0-rc.1, v1.0.0 |
| 25 oct | Revisión final, ensayo de demostración y entrega | — | — |
