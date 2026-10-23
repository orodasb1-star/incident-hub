// Repositorio en memoria: usado en pruebas y como fallback sin base de datos.
function crearMemoryRepo() {
  let seq = 1;
  let seqCom = 1;
  const incidentes = [];
  const comentarios = [];
  const tecnicos = [
    { id: 1, nombre: 'Tecnico Uno' },
    { id: 2, nombre: 'Tecnico Dos' },
  ];

  return {
    async crear(data) {
      const inc = { id: seq++, ...data, estado: 'NUEVO', tecnicoId: null, fecha: new Date().toISOString() };
      incidentes.push(inc);
      return inc;
    },
    async listar(filtros = {}, { limit = 50, offset = 0 } = {}) {
      const filtrados = incidentes.filter((i) =>
        (!filtros.estado || i.estado === filtros.estado) &&
        (!filtros.prioridad || i.prioridad === filtros.prioridad) &&
        (!filtros.categoria || i.categoria === filtros.categoria) &&
        (!filtros.tecnicoId || i.tecnicoId === Number(filtros.tecnicoId)));
      const ordenados = [...filtrados].reverse(); // mas recientes primero, igual que PostgreSQL
      return { items: ordenados.slice(offset, offset + limit), total: filtrados.length };
    },
    async obtener(id) { return incidentes.find((i) => i.id === Number(id)) || null; },
    async actualizar(id, cambios) {
      const inc = incidentes.find((i) => i.id === Number(id));
      if (!inc) return null;
      Object.assign(inc, cambios);
      return inc;
    },
    async tecnicos() { return tecnicos; },
    async agregarComentario(incidenteId, autor, texto) {
      const c = { id: seqCom++, incidenteId: Number(incidenteId), autor, texto, fecha: new Date().toISOString() };
      comentarios.push(c);
      return c;
    },
    async comentarios(incidenteId) { return comentarios.filter((c) => c.incidenteId === Number(incidenteId)); },
    async todos() { return incidentes; },
  };
}

module.exports = { crearMemoryRepo };
