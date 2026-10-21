// Repositorio PostgreSQL. La conexion se toma de DATABASE_URL (variable de entorno).
const { Pool } = require('pg');

function mapInc(r) {
  return r && {
    id: r.id, titulo: r.titulo, descripcion: r.descripcion, categoria: r.categoria,
    prioridad: r.prioridad, usuario: r.usuario, estado: r.estado,
    tecnicoId: r.tecnico_id, fecha: r.fecha,
  };
}

function crearPgRepo(connectionString = process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString });
  return {
    async crear(d) {
      const { rows } = await pool.query(
        `INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, usuario)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [d.titulo, d.descripcion, d.categoria, d.prioridad, d.usuario]);
      return mapInc(rows[0]);
    },
    async listar(f = {}) {
      const cond = []; const vals = [];
      if (f.estado) { vals.push(f.estado); cond.push(`estado = $${vals.length}`); }
      if (f.prioridad) { vals.push(f.prioridad); cond.push(`prioridad = $${vals.length}`); }
      if (f.categoria) { vals.push(f.categoria); cond.push(`categoria = $${vals.length}`); }
      if (f.tecnicoId) { vals.push(Number(f.tecnicoId)); cond.push(`tecnico_id = $${vals.length}`); }
      const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
      const { rows } = await pool.query(`SELECT * FROM incidentes ${where} ORDER BY id DESC`, vals);
      return rows.map(mapInc);
    },
    async obtener(id) {
      const { rows } = await pool.query('SELECT * FROM incidentes WHERE id = $1', [id]);
      return mapInc(rows[0]) || null;
    },
    async actualizar(id, c) {
      const sets = []; const vals = [];
      if (c.estado !== undefined) { vals.push(c.estado); sets.push(`estado = $${vals.length}`); }
      if (c.tecnicoId !== undefined) { vals.push(c.tecnicoId); sets.push(`tecnico_id = $${vals.length}`); }
      if (!sets.length) return this.obtener(id);
      vals.push(id);
      const { rows } = await pool.query(
        `UPDATE incidentes SET ${sets.join(', ')} WHERE id = $${vals.length} RETURNING *`, vals);
      return mapInc(rows[0]) || null;
    },
    async tecnicos() {
      const { rows } = await pool.query('SELECT id, nombre FROM tecnicos ORDER BY id');
      return rows;
    },
    async agregarComentario(incidenteId, autor, texto) {
      const { rows } = await pool.query(
        'INSERT INTO comentarios (incidente_id, autor, texto) VALUES ($1,$2,$3) RETURNING *',
        [incidenteId, autor, texto]);
      return rows[0];
    },
    async comentarios(incidenteId) {
      const { rows } = await pool.query(
        'SELECT * FROM comentarios WHERE incidente_id = $1 ORDER BY id', [incidenteId]);
      return rows;
    },
    async todos() { return this.listar({}); },
  };
}

module.exports = { crearPgRepo };
