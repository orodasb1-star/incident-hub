const { crearApp } = require('./app');
const { crearPgRepo } = require('./pgRepo');
const { crearMemoryRepo } = require('./memoryRepo');
const { log } = require('./logger');

const repo = process.env.DATABASE_URL ? crearPgRepo() : crearMemoryRepo();
if (!process.env.DATABASE_URL) log('warn', 'DATABASE_URL no definida: usando repositorio en memoria');

const port = process.env.PORT || 3000;
crearApp(repo).listen(port, () => log('info', 'API iniciada', { puerto: Number(port) }));
