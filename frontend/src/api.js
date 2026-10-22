const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || (data.errores || []).join(', ') || `Error ${res.status}`);
  return data;
}

export const api = {
  listar: (filtros) => {
    const qs = new URLSearchParams(Object.entries(filtros).filter(([, v]) => v)).toString();
    return request(`/incidentes${qs ? `?${qs}` : ''}`);
  },
  crear: (inc) => request('/incidentes', { method: 'POST', body: inc }),
  asignar: (id, tecnicoId) => request(`/incidentes/${id}/asignar`, { method: 'PATCH', body: { tecnicoId } }),
  cambiarEstado: (id, estado) => request(`/incidentes/${id}/estado`, { method: 'PATCH', body: { estado } }),
  comentarios: (id) => request(`/incidentes/${id}/comentarios`),
  comentar: (id, autor, texto) => request(`/incidentes/${id}/comentarios`, { method: 'POST', body: { autor, texto } }),
  tecnicos: () => request('/tecnicos'),
  dashboard: () => request('/dashboard'),
};

export const ESTADOS = ['NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];
export const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
export const CATEGORIAS = ['HARDWARE', 'SOFTWARE', 'RED', 'ACCESO', 'OTRO'];
export const SIGUIENTES = {
  NUEVO: [], ASIGNADO: ['EN_PROCESO'], EN_PROCESO: ['RESUELTO'], RESUELTO: ['CERRADO', 'EN_PROCESO'], CERRADO: [],
};
