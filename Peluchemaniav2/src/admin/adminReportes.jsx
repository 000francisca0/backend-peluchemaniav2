import React, { useState } from 'react';
import { API_BASE } from '../lib/api.js';


export default function AdminReportes() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sales, setSales] = useState(null);
  const [tops, setTops] = useState([]);

  const CLP = (n)=> new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(Number(n||0));

  async function run() {
    const qs = (from && to) ? `?from=${from}&to=${to}` : '';
    const [s, t] = await Promise.all([
      fetch(`${API_BASE}/reportes/sales${qs}`).then(r=>r.json()),
      fetch(`${API_BASE}/reportes/top-products${qs}`).then(r=>r.json()),
    ]);
    
    // --- CAMBIOS AQUÍ ---
    setSales(s || null); // Arreglado (antes era s.data)
    setTops(t || []);   // Arreglado (antes era t.data)
    // --- FIN DE CAMBIOS ---
  }

  return (
    <main className="main-content">
      <div className="container">
        <div className="card"><div className="card-body">
          <h1 style={{marginTop:0}}>Reportes</h1>

          <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
            <span>—</span>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
            <button className="btn btn-primary" onClick={run}>Generar</button>
          </div>

          {sales && (
            <div style={{marginTop:16}}>
              <h3>Resumen de Ventas</h3>
              <p>Boletas: <strong>{sales.num_boletas}</strong></p>
              <p>Total vendido: <strong>{CLP(sales.total_vendido)}</strong></p>
            </div>
          )}

          {tops.length > 0 && (
            <div style={{marginTop:16}}>
              <h3>Top Productos</h3>
              <div className="grid">
                {tops.map(tp=>(
                  <div key={tp.producto_id} className="card" style={{padding:12}}>
                    <h4 style={{marginTop:0}}>{tp.nombre_producto}</h4>
                    <p>Unidades: {tp.unidades}</p>
                    <p>Total: {CLP(tp.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div></div>
      </div>
    </main>
  );
}