// Manejo centralizado de errores: traduce errores conocidos a respuestas 4xx claras.
const { log } = require('./logger');

// Codigos de error de PostgreSQL relevantes
const PG = {
  '22P02': { status: 400, error: 'Formato de dato invalido' },   // invalid_text_representation (ej. id no numerico)
  '23503': { status: 400, error: 'Referencia inexistente' },     // foreign_key_violation
  '23514': { status: 400, error: 'Valor fuera de lo permitido' }, // check_violation
  '23502': { status: 400, error: 'Campo obligatorio faltante' },  // not_null_violation
};

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON invalido en el cuerpo de la peticion' });
  }
  if (err.code && PG[err.code]) {
    log('warn', 'error de base de datos controlado', { requestId: req.id, codigo: err.code, detalle: err.message });
    return res.status(PG[err.code].status).json({ error: PG[err.code].error });
  }
  log('error', 'error no controlado', { requestId: req.id, error: err.message, stack: err.stack });
  return res.status(500).json({ error: 'Error interno', requestId: req.id });
}

module.exports = { errorHandler };
