const { PRIORIDADES, CATEGORIAS, ESTADOS } = require('./constants');

function validarIncidente(body) {
  const errores = [];
  if (!body.titulo || String(body.titulo).trim().length < 3) errores.push('titulo requerido (min 3 caracteres)');
  if (!body.descripcion || String(body.descripcion).trim().length < 5) errores.push('descripcion requerida (min 5 caracteres)');
  if (!CATEGORIAS.includes(body.categoria)) errores.push(`categoria invalida (${CATEGORIAS.join(', ')})`);
  if (!PRIORIDADES.includes(body.prioridad)) errores.push(`prioridad invalida (${PRIORIDADES.join(', ')})`);
  if (!body.usuario || !String(body.usuario).trim()) errores.push('usuario requerido');
  return errores;
}

function validarEstado(estado) {
  return ESTADOS.includes(estado);
}

module.exports = { validarIncidente, validarEstado };
