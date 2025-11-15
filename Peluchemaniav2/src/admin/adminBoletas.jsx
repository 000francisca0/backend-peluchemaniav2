import React, { useEffect, useState } from 'react';
import { API_BASE } from '../lib/api.js';

export default function AdminBoletas() {
  const [boletas, setBoletas] = useState([]);
  const [view, setView] = useState(null);

  useEffect(()=>{ load(); },[]);
  async function load(){
    const r = await fetch(`${API_BASE}/boletas`);
    const j = await r.json();
    setBoletas(j || []); // <-- CAMBIO 1: (j.data -> j)
  }

  async function open(id){
    // (Nota: esta ruta /api/boletas/:id aún no la hemos creado en el backend)
    const r = await fetch(`${API_BASE}/boletas/${id}`); 
    const j = await r.json();
    setView(j); // <-- CAMBIO 2: (j.data -> j)
  }

  const CLP = (n)=> new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(Number(n||0));

  return (
    <main className="main-content">
      <div className="container">
        <div className="card"><div className="card-body">
          <h1 style={{marginTop:0}}>Boletas</h1>
          <div className="grid">
            {boletas.map(b=>(
              <div key={b.id} className="card" style={{padding:12}}>
                <p><strong>ID:</strong> {b.id}</p>
                {/* CAMBIO 3: La API envía 'usuarioId', no 'cliente' */}
                <p><strong>Usuario ID:</strong> {b.usuarioId}</p> 
                {/* CAMBIO 4: La API envía 'fechaCompra' (camelCase) */}
                <p><strong>Fecha:</strong> {new Date(b.fechaCompra).toLocaleString()}</p>
                <p><strong>Total:</strong> {CLP(b.total)}</p>
                {/* Deshabilitamos 'Ver' hasta que creemos el endpoint */}
                {/* <button className="btn btn-primary" onClick={()=>open(b.id)}>Ver</button> */}
              </div>
            ))}
          </div>
        </div></div>

        {view && (
          <div className="card" style={{marginTop:20}}>
            <div className="card-body">
              <h2 style={{marginTop:0}}>Boleta #{view.id}</h2>
              {/* ... (código del visor de detalles) ... */}
              <div style={{marginTop:10}}>
                <button className="btn btn-ghost" onClick={()=>setView(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}