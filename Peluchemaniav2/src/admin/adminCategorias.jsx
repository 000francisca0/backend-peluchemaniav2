import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { API_BASE } from '../lib/api.js';

export default function AdminCategorias() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/categorias`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar categorías');
      setCats(data || []); // <-- CAMBIO 1 (data.data -> data)
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (El resto del archivo está bien, pero las funciones
  // create, update y delete fallarán hasta que creemos esos endpoints) ...
  
  useEffect(() => { load(); }, []);

  const createCat = async () => {
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/categorias`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre: newName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear');
      setNewName('');
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const updateCat = async (id) => {
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/categorias/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre: editName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      setEditing(null);
      setEditName('');
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const deleteCat = async (id) => {
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/categorias/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar');
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <main className="main-content">
      <div className="container">
        <div className="card">
          <div className="card-body">
            <h1 style={{ marginTop: 0 }}>Categorías</h1>
            <p className="card-sub">Crea, renombra o elimina categorías.</p>

            {err && <div className="server-error-message" style={{ marginBottom: 12 }}>{err}</div>}

            {/* Create */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <input
                className="form-control"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre de la categoría"
                style={{ maxWidth: 360 }}
              />
              <button className="btn btn-primary" onClick={createCat} disabled={!newName.trim()}>
                <FaPlus style={{ marginRight: 6 }} />
                Crear
              </button>
            </div>

            {/* List */}
            {loading ? <p>Cargando...</p> : (
              <div className="grid">
                {cats.map(c => (
                  <article key={c.id} className="card">
                    <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {editing === c.id ? (
                        <>
                          <input
                            className="form-control"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <button className="btn btn-primary" onClick={() => updateCat(c.id)} disabled={!editName.trim()}>
                            Guardar
                          </button>
                          <button className="btn btn-ghost" onClick={() => { setEditing(null); setEditName(''); }}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <h3 className="card-title" style={{ margin: 0, flex: 1 }}>{c.nombre}</h3>
                          <button className="btn btn-ghost" onClick={() => { setEditing(c.id); setEditName(c.nombre); }}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-ghost" onClick={() => deleteCat(c.id)}>
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}