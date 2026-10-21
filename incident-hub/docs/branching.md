# Estrategia de ramas (branching)

Se usa un modelo **trunk-based con ramas cortas**:

| Rama | Uso | Ejemplo |
|---|---|---|
| `main` | Código estable y liberable. Protegida. | — |
| `feature/*` | Nueva funcionalidad | `feature/api-incidentes` |
| `fix/*` | Corrección de errores | `fix/pipeline-junit` |
| `refactor/*` | Pago de deuda técnica sin cambiar funcionalidad visible | `refactor/deuda-paginacion` |
| `chore/*` | Mantenimiento, versiones, configuración | `chore/release-1.0.0` |

## Flujo

1. Se toma una Task en Azure Boards (pasa a *Active*).
2. Se crea la rama desde `main` actualizado.
3. Commits con el formato `tipo: descripción AB#<id>` (Conventional Commits).
4. Push y Pull Request hacia `main` con descripción, Work Items vinculados y evidencia de pruebas.
5. Revisión documentada en el PR (comentarios resueltos + aprobación) y build de validación verde.
6. Completar con **Merge (no fast-forward)** (conserva los commits y sus `AB#ID`), marcar *Complete associated work items* y borrar la rama.

## Políticas de `main` (Azure Repos → Branch policies)
- Mínimo 1 aprobación. Como la organización de la universidad no permite invitar usuarios, se habilitó
  *Allow requestors to approve their own changes*; los roles Desarrollo y QA se distinguen por la identidad de Git
  del autor de los commits.
- Work Items vinculados obligatorios.
- Comentarios resueltos obligatorios.
- Build validation: pipeline `incident-hub` debe pasar.

## Repositorios
- **Azure Repos** (`origin`): repositorio principal.
- **GitHub**: espejo; recibe los mismos push y ejecuta GitHub Actions.
