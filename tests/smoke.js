// Prueba de humo: verifica que una API desplegada responda.
// Uso: node tests/smoke.js http://localhost:3000
const base = process.argv[2] || process.env.API_URL || 'http://localhost:3000';

(async () => {
  try {
    const health = await fetch(`${base}/api/health`).then((r) => r.json());
    if (health.status !== 'ok') throw new Error('health != ok');
    const dash = await fetch(`${base}/api/dashboard`).then((r) => r.json());
    if (typeof dash.abiertos !== 'number') throw new Error('dashboard sin indicadores');
    console.log(`OK: ${base} responde (abiertos=${dash.abiertos})`);
  } catch (e) {
    console.error(`FALLO prueba de humo contra ${base}: ${e.message}`);
    process.exit(1);
  }
})();
