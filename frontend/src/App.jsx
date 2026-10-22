import { useEffect, useState, useCallback } from 'react';
import { api, ESTADOS, PRIORIDADES, CATEGORIAS, SIGUIENTES } from './api.js';

const VACIO = { titulo: '', descripcion: '', categoria: 'HARDWARE', prioridad: 'MEDIA', usuario: '' };

function Dashboard({ datos, tecnicos }) {
  if (!datos) return null;
  const nombre = (id) => tecnicos.find((t) => String(t.id) === String(id))?.nombre || 'Sin asignar';
  return (
    <section className="dashboard">
      <div className="kpi"><span>{datos.abiertos}</span>Abiertos</div>
      <div className="kpi"><span>{datos.cerrados}</span>Cerrados</div>
      <div className="kpi critico"><span>{datos.criticos}</span>Críticos abiertos</div>
      <div className="dist">
        <h4>Por categoría</h4>
        {Object.entries(datos.porCategoria).map(([k, v]) => <p key={k}>{k}: <b>{v}</b></p>)}
      </div>
      <div className="dist">
        <h4>Por técnico</h4>
        {Object.entries(datos.porTecnico).map(([k, v]) => <p key={k}>{nombre(k)}: <b>{v}</b></p>)}
      </div>
    </section>
  );
}

function NuevoIncidente({ onCreado }) {
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const enviar = async (e) => {
    e.preventDefault();
    try { await api.crear(form); setForm(VACIO); setError(''); onCreado(); } catch (err) { setError(err.message); }
  };
  return (
    <form className="card" onSubmit={enviar}>
      <h3>Nuevo incidente</h3>
      <input placeholder="Título" value={form.titulo} onChange={set('titulo')} />
      <textarea placeholder="Descripción" value={form.descripcion} onChange={set('descripcion')} />
      <div className="fila">
        <select value={form.categoria} onChange={set('categoria')}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={form.prioridad} onChange={set('prioridad')}>{PRIORIDADES.map((p) => <option key={p}>{p}</option>)}</select>
      </div>
      <input placeholder="Usuario que reporta" value={form.usuario} onChange={set('usuario')} />
      {error && <p className="error">{error}</p>}
      <button type="submit">Registrar</button>
    </form>
  );
}

function Detalle({ inc, tecnicos, onCambio }) {
  const [coms, setComs] = useState([]);
  const [texto, setTexto] = useState('');
  const [autor, setAutor] = useState('');
  const [error, setError] = useState('');
  const cargar = useCallback(() => api.comentarios(inc.id).then(setComs), [inc.id]);
  useEffect(() => { cargar(); }, [cargar]);

  const accion = async (fn) => {
    try { await fn(); setError(''); onCambio(); cargar(); } catch (err) { setError(err.message); }
  };
  return (
    <div className="card detalle">
      <h3>#{inc.id} {inc.titulo}</h3>
      <p>{inc.descripcion}</p>
      <p className="meta">{inc.categoria} · {inc.prioridad} · {inc.usuario} · {new Date(inc.fecha).toLocaleString()}</p>
      <p>Estado: <span className={`badge ${inc.estado}`}>{inc.estado}</span></p>
      {(inc.estado === 'NUEVO' || inc.estado === 'ASIGNADO') && (
        <select defaultValue="" onChange={(e) => e.target.value && accion(() => api.asignar(inc.id, Number(e.target.value)))}>
          <option value="">Asignar técnico…</option>
          {tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
      )}
      {SIGUIENTES[inc.estado].map((s) => (
        <button key={s} onClick={() => accion(() => api.cambiarEstado(inc.id, s))}>Pasar a {s}</button>
      ))}
      {error && <p className="error">{error}</p>}
      <h4>Bitácora</h4>
      <ul className="bitacora">
        {coms.map((c) => <li key={c.id}><b>{c.autor}</b>: {c.texto} <small>{new Date(c.fecha).toLocaleString()}</small></li>)}
        {!coms.length && <li className="meta">Sin comentarios</li>}
      </ul>
      <div className="fila">
        <input placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
        <input placeholder="Comentario" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <button onClick={() => accion(async () => { await api.comentar(inc.id, autor, texto); setTexto(''); })}>Agregar</button>
      </div>
    </div>
  );
}

export default function App() {
  const [incidentes, setIncidentes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [dash, setDash] = useState(null);
  const [filtros, setFiltros] = useState({ estado: '', prioridad: '', categoria: '', tecnicoId: '' });
  const [sel, setSel] = useState(null);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    try {
      const [lista, d] = await Promise.all([api.listar(filtros), api.dashboard()]);
      setIncidentes(lista); setDash(d); setError('');
    } catch (err) { setError(`No se pudo conectar con la API: ${err.message}`); }
  }, [filtros]);

  useEffect(() => { api.tecnicos().then(setTecnicos).catch(() => {}); }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const seleccionado = incidentes.find((i) => i.id === sel);
  const setF = (k) => (e) => setFiltros({ ...filtros, [k]: e.target.value });
  const nombreTec = (id) => tecnicos.find((t) => t.id === id)?.nombre || '—';

  return (
    <main>
      <header><h1>IT Incident Hub</h1></header>
      {error && <p className="error">{error}</p>}
      <Dashboard datos={dash} tecnicos={tecnicos} />
      <div className="layout">
        <section>
          <div className="filtros">
            <select value={filtros.estado} onChange={setF('estado')}><option value="">Estado</option>{ESTADOS.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={filtros.prioridad} onChange={setF('prioridad')}><option value="">Prioridad</option>{PRIORIDADES.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={filtros.categoria} onChange={setF('categoria')}><option value="">Categoría</option>{CATEGORIAS.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={filtros.tecnicoId} onChange={setF('tecnicoId')}><option value="">Técnico</option>{tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select>
          </div>
          <table>
            <thead><tr><th>#</th><th>Título</th><th>Categoría</th><th>Prioridad</th><th>Técnico</th><th>Estado</th></tr></thead>
            <tbody>
              {incidentes.map((i) => (
                <tr key={i.id} onClick={() => setSel(i.id)} className={i.id === sel ? 'activo' : ''}>
                  <td>{i.id}</td><td>{i.titulo}</td><td>{i.categoria}</td>
                  <td className={i.prioridad === 'CRITICA' ? 'critica' : ''}>{i.prioridad}</td>
                  <td>{nombreTec(i.tecnicoId)}</td><td><span className={`badge ${i.estado}`}>{i.estado}</span></td>
                </tr>
              ))}
              {!incidentes.length && <tr><td colSpan="6" className="meta">Sin incidentes</td></tr>}
            </tbody>
          </table>
        </section>
        <aside>
          {seleccionado
            ? <Detalle key={seleccionado.id} inc={seleccionado} tecnicos={tecnicos} onCambio={cargar} />
            : <NuevoIncidente onCreado={cargar} />}
          {seleccionado && <button className="secundario" onClick={() => setSel(null)}>+ Nuevo incidente</button>}
        </aside>
      </div>
    </main>
  );
}
