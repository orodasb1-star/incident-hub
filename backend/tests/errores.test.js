const request = require('supertest');
const { crearApp } = require('../src/app');
const { crearMemoryRepo } = require('../src/memoryRepo');
const { errorHandler } = require('../src/errorHandler');

describe('Manejo de errores y logging (DT-05)', () => {
  const app = crearApp(crearMemoryRepo());

  test('JSON mal formado responde 400 (antes 500)', async () => {
    const res = await request(app).post('/api/incidentes')
      .set('Content-Type', 'application/json').send('{"titulo": ');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/JSON invalido/);
  });

  test('ruta inexistente responde 404 en JSON', async () => {
    const res = await request(app).get('/api/no-existe');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Ruta no encontrada');
  });

  test('cada respuesta incluye X-Request-Id', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-request-id']).toBeDefined();
  });

  test('error de PostgreSQL 22P02 se traduce a 400', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    errorHandler({ code: '22P02', message: 'invalid input syntax' }, { id: 'x' }, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('error desconocido responde 500 con requestId', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    errorHandler(new Error('boom'), { id: 'abc' }, res, () => {});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno', requestId: 'abc' });
  });
});
