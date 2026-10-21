const request = require('supertest');
const { crearApp } = require('../src/app');
const { crearMemoryRepo } = require('../src/memoryRepo');

const valido = {
  titulo: 'No hay internet', descripcion: 'Sin conexion en oficina 3',
  categoria: 'RED', prioridad: 'CRITICA', usuario: 'omar',
};

let app;
beforeEach(() => { app = crearApp(crearMemoryRepo()); });

describe('Incidentes', () => {
  test('crea un incidente en estado NUEVO', async () => {
    const res = await request(app).post('/api/incidentes').send(valido);
    expect(res.status).toBe(201);
    expect(res.body.estado).toBe('NUEVO');
  });

  test('rechaza incidente invalido', async () => {
    const res = await request(app).post('/api/incidentes').send({ titulo: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.errores.length).toBeGreaterThan(0);
  });

  test('consulta y filtra por prioridad', async () => {
    await request(app).post('/api/incidentes').send(valido);
    await request(app).post('/api/incidentes').send({ ...valido, prioridad: 'BAJA' });
    const res = await request(app).get('/api/incidentes?prioridad=CRITICA');
    expect(res.body).toHaveLength(1);
  });

  test('404 si no existe', async () => {
    expect((await request(app).get('/api/incidentes/99')).status).toBe(404);
  });
});

describe('Operacion', () => {
  test('asigna tecnico y cambia estado a ASIGNADO', async () => {
    const { body } = await request(app).post('/api/incidentes').send(valido);
    const res = await request(app).patch(`/api/incidentes/${body.id}/asignar`).send({ tecnicoId: 1 });
    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('ASIGNADO');
    expect(res.body.tecnicoId).toBe(1);
  });

  test('flujo completo de estados hasta CERRADO', async () => {
    const { body } = await request(app).post('/api/incidentes').send(valido);
    await request(app).patch(`/api/incidentes/${body.id}/asignar`).send({ tecnicoId: 1 });
    for (const estado of ['EN_PROCESO', 'RESUELTO', 'CERRADO']) {
      const r = await request(app).patch(`/api/incidentes/${body.id}/estado`).send({ estado });
      expect(r.body.estado).toBe(estado);
    }
  });

  test('rechaza transicion invalida NUEVO -> CERRADO', async () => {
    const { body } = await request(app).post('/api/incidentes').send(valido);
    const res = await request(app).patch(`/api/incidentes/${body.id}/estado`).send({ estado: 'CERRADO' });
    expect(res.status).toBe(409);
  });
});

describe('Bitacora y dashboard', () => {
  test('agrega y lista comentarios', async () => {
    const { body } = await request(app).post('/api/incidentes').send(valido);
    await request(app).post(`/api/incidentes/${body.id}/comentarios`).send({ autor: 'omar', texto: 'Revisando router' });
    const res = await request(app).get(`/api/incidentes/${body.id}/comentarios`);
    expect(res.body).toHaveLength(1);
  });

  test('dashboard calcula indicadores', async () => {
    await request(app).post('/api/incidentes').send(valido);
    const res = await request(app).get('/api/dashboard');
    expect(res.body.abiertos).toBe(1);
    expect(res.body.criticos).toBe(1);
    expect(res.body.porCategoria.RED).toBe(1);
  });
});
