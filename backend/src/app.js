const express = require('express');
const cors = require('cors');
const { validarIncidente, validarEstado } = require('./validators');
const { TRANSICIONES } = require('./constants');

function crearApp(repo) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  // --- Incidentes ---
  app.post('/api/incidentes', async (req, res, next) => {
    try {
      const errores = validarIncidente(req.body);
      if (errores.length) return res.status(400).json({ errores });
      const { titulo, descripcion, categoria, prioridad, usuario } = req.body;
      res.status(201).json(await repo.crear({ titulo, descripcion, categoria, prioridad, usuario }));
    } catch (e) { next(e); }
  });

  app.get('/api/incidentes', async (req, res, next) => {
    try { res.json(await repo.listar(req.query)); } catch (e) { next(e); }
  });

  app.get('/api/incidentes/:id', async (req, res, next) => {
    try {
      const inc = await repo.obtener(req.params.id);
      if (!inc) return res.status(404).json({ error: 'Incidente no encontrado' });
      res.json(inc);
    } catch (e) { next(e); }
  });

  // --- Operacion: asignar tecnico ---
  app.patch('/api/incidentes/:id/asignar', async (req, res, next) => {
    try {
      const inc = await repo.obtener(req.params.id);
      if (!inc) return res.status(404).json({ error: 'Incidente no encontrado' });
      const tecs = await repo.tecnicos();
      const tecnicoId = Number(req.body.tecnicoId);
      if (!tecs.some((t) => t.id === tecnicoId)) return res.status(400).json({ error: 'Tecnico invalido' });
      if (inc.estado !== 'NUEVO' && inc.estado !== 'ASIGNADO') {
        return res.status(409).json({ error: 'Solo se puede asignar en estado NUEVO o ASIGNADO' });
      }
      res.json(await repo.actualizar(inc.id, { tecnicoId, estado: 'ASIGNADO' }));
    } catch (e) { next(e); }
  });

  // --- Operacion: cambiar estado ---
  app.patch('/api/incidentes/:id/estado', async (req, res, next) => {
    try {
      const inc = await repo.obtener(req.params.id);
      if (!inc) return res.status(404).json({ error: 'Incidente no encontrado' });
      const { estado } = req.body;
      if (!validarEstado(estado)) return res.status(400).json({ error: 'Estado invalido' });
      if (!TRANSICIONES[inc.estado].includes(estado)) {
        return res.status(409).json({ error: `Transicion no permitida: ${inc.estado} -> ${estado}` });
      }
      res.json(await repo.actualizar(inc.id, { estado }));
    } catch (e) { next(e); }
  });

  // --- Seguimiento: bitacora ---
  app.post('/api/incidentes/:id/comentarios', async (req, res, next) => {
    try {
      const inc = await repo.obtener(req.params.id);
      if (!inc) return res.status(404).json({ error: 'Incidente no encontrado' });
      const { autor, texto } = req.body;
      if (!autor || !texto) return res.status(400).json({ error: 'autor y texto son requeridos' });
      res.status(201).json(await repo.agregarComentario(inc.id, autor, texto));
    } catch (e) { next(e); }
  });

  app.get('/api/incidentes/:id/comentarios', async (req, res, next) => {
    try { res.json(await repo.comentarios(req.params.id)); } catch (e) { next(e); }
  });

  app.get('/api/tecnicos', async (_req, res, next) => {
    try { res.json(await repo.tecnicos()); } catch (e) { next(e); }
  });

  // --- Indicadores ---
  app.get('/api/dashboard', async (_req, res, next) => {
    try {
      const todos = await repo.todos();
      const contar = (campo) => todos.reduce((acc, i) => {
        const k = i[campo] ?? 'SIN_ASIGNAR';
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {});
      res.json({
        abiertos: todos.filter((i) => i.estado !== 'CERRADO').length,
        cerrados: todos.filter((i) => i.estado === 'CERRADO').length,
        criticos: todos.filter((i) => i.prioridad === 'CRITICA' && i.estado !== 'CERRADO').length,
        porCategoria: contar('categoria'),
        porTecnico: contar('tecnicoId'),
      });
    } catch (e) { next(e); }
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  });

  return app;
}

module.exports = { crearApp };
