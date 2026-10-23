// Logging estructurado (una linea JSON por evento). Silencioso durante las pruebas.
const crypto = require('crypto');

const silencioso = () => process.env.NODE_ENV === 'test';

function log(nivel, mensaje, datos = {}) {
  if (silencioso()) return;
  const linea = JSON.stringify({ ts: new Date().toISOString(), nivel, mensaje, ...datos });
  if (nivel === 'error') console.error(linea); else console.log(linea);
}

// Middleware: asigna un id a cada peticion y registra metodo, ruta, estado y duracion.
function requestLogger(req, res, next) {
  const inicio = Date.now();
  req.id = req.get('X-Request-Id') || crypto.randomUUID();
  res.set('X-Request-Id', req.id);
  res.on('finish', () => {
    log('info', 'request', {
      requestId: req.id, metodo: req.method, ruta: req.originalUrl,
      estado: res.statusCode, ms: Date.now() - inicio,
    });
  });
  next();
}

module.exports = { log, requestLogger };
