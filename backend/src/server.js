const { crearApp } = require('./app');
const { crearPgRepo } = require('./pgRepo');
const { crearMemoryRepo } = require('./memoryRepo');

const repo = process.env.DATABASE_URL ? crearPgRepo() : crearMemoryRepo();
if (!process.env.DATABASE_URL) console.warn('DATABASE_URL no definida: usando repositorio en memoria');

const port = process.env.PORT || 3000;
crearApp(repo).listen(port, () => console.log(`API escuchando en puerto ${port}`));
