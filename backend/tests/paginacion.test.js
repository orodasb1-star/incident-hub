const request = require('supertest');
const { crearApp } = require('../src/app');
const { crearMemoryRepo } = require('../src/memoryRepo');

const base = { descripcion: 'Prueba de paginacion', categoria: 'OTRO', prioridad: 'BAJA', usuario: 'qa' };

describe('Paginacion de incidentes (DT-02)', () => {
  let app;
  beforeEach(async () => {
    app = crearApp(crearMemoryRepo());
    for (let i = 1; i <= 12; i++) {
      await request(app).post('/api/incidentes').send({ ...base, titulo: `Incidente ${i}` });
    }
  });

  test('devuelve la pagina solicitada y el total en X-Total-Count', async () => {
    const res = await request(app).get('/api/incidentes?limit=5&page=2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
    expect(res.headers['x-total-count']).toBe('12');
    expect(res.body[0].titulo).toBe('Incidente 7');
  });

  test('ultima pagina incompleta', async () => {
    const res = await request(app).get('/api/incidentes?limit=5&page=3');
    expect(res.body).toHaveLength(2);
  });

  test('limite maximo de 100 y valores invalidos usan los valores por defecto', async () => {
    const res = await request(app).get('/api/incidentes?limit=5000&page=abc');
    expect(res.headers['x-limit']).toBe('100');
    expect(res.headers['x-page']).toBe('1');
  });
});
