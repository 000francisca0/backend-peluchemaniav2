import React, { useEffect, useState } from 'react';
import { API_BASE } from '../lib/api.js';


export default function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(null); // selected user with history
  const [editing, setEditing] = useState(null);

  useEffect(()=>{ load(); },[]);
  async function load(){
    const r = await fetch(`${API_BASE}/users`);
    const j = await r.json();
    setUsers(j || []); // <-- CAMBIO 1 (j.data -> j)
  }

  async function openUser(u){
    const r = await fetch(`${API_BASE}/users/${u.id}/boletas`); // (Esta ruta aún no la creamos)
    const j = await r.json();
    setView({ ...u, boletas: j || [] }); // <-- CAMBIO 2 (j.data -> j)
  }

  async function saveEdit(){
    // (Esta ruta PUT /api/users/:id aún no la creamos)
    await fetch(`${API_BASE}/users/${editing.id}`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(editing)
    });
    setEditing(null); setView(null); load();
  }

  return (
    // ... (El resto del JSX está bien, pero las funciones 'openUser' y 'saveEdit'
    // fallarán hasta que creemos esos endpoints en el backend) ...
    
    <main className="main-content">
      <div className="container">

        <div className="card" style={{marginBottom:20}}>
          <div className="card-body">
            <h1 style={{marginTop:0}}>Usuarios</h1>
            <div className="grid">
              {users.map(u=>(
                <div key={u.id} className="card" style={{padding:12}}>
                  <h3 style={{marginTop:0}}>{u.nombre} {u.apellidos}</h3>
                  <p className="card-sub">{u.email}</p>
                  {/* La API de Spring envía 'rol' como un objeto */}
                  <p className="card-sub">Rol: {u.rol?.nombre}</p> 
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn btn-primary" onClick={()=>openUser(u)}>Ver</button>
                    <button className="btn btn-ghost" onClick={()=>setEditing(u)}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIEW (Fallará hasta que creemos GET /api/users/:id/boletas) */}
        {view && (
           <div className="card" style={{marginBottom:20}}>
             {/* ... (código del visor) ... */}
           </div>
        )}

        {/* EDIT (Fallará hasta que creemos PUT /api/users/:id) */}
        {editing && (
          <div className="card">
            {/* ... (código de edición) ... */}
          </div>
        )}

      </div>
    </main>
  );
}