// Valida un paquete desplegado: arranca la API del artefacto, ejecuta la prueba de humo y la detiene.
// Uso: node validar-despliegue.js <carpeta-incident-hub-extraida> [puerto]
const { spawn } = require('child_process');
const path = require('path');

const raiz = path.resolve(process.argv[2] || '.');
const puerto = process.argv[3] || '3100';
const base = `http://localhost:${puerto}`;

// Proyecto academico: no hay PostgreSQL publico, la validacion usa el repositorio en memoria.
const env = { ...process.env, PORT: puerto };
delete env.DATABASE_URL;

const api = spawn(process.execPath, [path.join(raiz, 'backend', 'src', 'server.js')], { env, stdio: 'inherit' });

async function esperarSalud(intentos = 20) {
  for (let i = 0; i < intentos; i++) {
    try {
      const r = await fetch(`${base}/api/health`);
      if (r.ok) return;
    } catch { /* aun no arranca */ }
    await new Promise((ok) => setTimeout(ok, 500));
  }
  throw new Error('La API no respondio a tiempo');
}

(async () => {
  let codigo = 0;
  try {
    await esperarSalud();
    const smoke = spawn(process.execPath, [path.join(raiz, 'tests', 'smoke.js'), base], { stdio: 'inherit' });
    codigo = await new Promise((ok) => smoke.on('exit', ok));
  } catch (e) {
    console.error(`FALLO validacion: ${e.message}`);
    codigo = 1;
  } finally {
    api.kill();
  }
  console.log(codigo === 0 ? 'Despliegue validado correctamente' : 'Despliegue NO valido');
  process.exit(codigo);
})();
