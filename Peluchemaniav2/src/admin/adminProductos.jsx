import React, { useEffect, useState } from 'react';
import { API_BASE } from '../lib/api.js';


export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [criticos, setCriticos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estado para el formulario de 'Nuevo Producto'
  const [nuevo, setNuevo] = useState({
    nombre: '', 
    precio: '', 
    stock: '', 
    categoriaId: '', // <- CAMBIO: 'categoria_id' a 'categoriaId'
    imagenUrl: '', // <- CAMBIO: 'imagen_url' a 'imagenUrl'
    discountPercentage: 0, // <- CAMBIO: 'discount_percentage' a 'discountPercentage'
    onSale: false
  });
  
  const [editando, setEditando] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      // (La ruta /productos/low-stock ya la creamos en el backend)
      const [pRes, cRes, lRes] = await Promise.all([
        fetch(`${API_BASE}/productos`),
        fetch(`${API_BASE}/categorias`),
        fetch(`${API_BASE}/productos/low-stock`), 
      ]);
      
      const p = await pRes.json();
      const c = await cRes.json();
      const l = await lRes.json();

      // --- ¡ARREGLO DEL SYNTAXERROR! ---
      setProductos(p || []); // (p.data -> p)
      setCategorias(c || []); // (c.data -> c)
      setCriticos(l || []);   // (l.data -> l)
      // --- FIN DE CAMBIOS ---
    } catch (e) {
      console.error("Error cargando datos: ", e);
      // alert("Error cargando datos. Revisa la consola."); // Comentado
    }
  }

  async function crearProducto() {
    try {
      const res = await fetch(`${API_BASE}/productos`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          ...nuevo,
          precio: Number(nuevo.precio || 0),
          stock: Number(nuevo.stock || 0),
          // Aseguramos que el ID de categoría se envíe como número
          categoriaId: Number(nuevo.categoriaId) || null,
          discountPercentage: nuevo.discountPercentage === '' ? null : Number(nuevo.discountPercentage)
        }),
      });
      if (!res.ok) throw new Error('Error al crear el producto');
      setNuevo({ nombre:'', precio:'', stock:'', categoriaId:'', imagenUrl:'', discountPercentage:0, onSale: false });
      loadAll();
    } catch (e) {
      alert(e.message);
    }
  }

  async function eliminarProducto(id) {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    try {
      const res = await fetch(`${API_BASE}/productos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al eliminar el producto');
      }
      loadAll();
    } catch (e) {
      alert(e.message);
    }
  }

  async function guardarEdicion() {
    try {
      const res = await fetch(`${API_BASE}/productos/${editando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          // Enviamos los datos en el formato DTO que espera Spring
          nombre: editando.nombre,
          descripcion: editando.descripcion,
          precio: Number(editando.precio || 0),
          stock: Number(editando.stock || 0),
          // Enviamos el ID de la categoría, no el objeto
          categoriaId: editando.categoria?.id || null, 
          imagenUrl: editando.imagenUrl,
          onSale: editando.onSale,
          discountPercentage: editando.discountPercentage === '' ? null : Number(editando.discountPercentage)
        }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setEditando(null);
      loadAll();
    } catch (e) {
      alert(e.message);
    }
  }

  // (Esta ruta /upload-image aún no la hemos creado, fallará)
  async function subirImagen(file, setTarget) {
    // ... (código de subirImagen) ...
  }

  const Precio = ({ p }) => (
    <span>
      {new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP'}).format(Number(p || 0))}
    </span>
  );

  return (
    <main className="main-content">
      <div className="container">

        {/* Form nuevo */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <h1 style={{ marginTop:0 }}>Administrar Productos</h1>
            <p className="card-sub">Crear / editar / eliminar. También verás productos con stock crítico.</p>

            <div style={{ display:'grid', gap:8, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', marginTop:12 }}>
              <input placeholder="Nombre" value={nuevo.nombre} onChange={e=>setNuevo({...nuevo, nombre:e.target.value})}/>
              <input placeholder="Precio" type="number" value={nuevo.precio} onChange={e=>setNuevo({...nuevo, precio:e.target.value})}/>
              <input placeholder="Stock" type="number" value={nuevo.stock} onChange={e=>setNuevo({...nuevo, stock:e.target.value})}/>
              
              {/* CAMBIO: 'categoria_id' -> 'categoriaId' */}
              <select value={nuevo.categoriaId} onChange={e=>setNuevo({...nuevo, categoriaId:e.target.value})}>
                <option value="">Categoría</option>
                {categorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              
              {/* CAMBIO: 'discount_percentage' -> 'discountPercentage' */}
              <input placeholder="Descuento (0..1)" type="number" step="0.01" value={nuevo.discountPercentage}
                     onChange={e=>setNuevo({...nuevo, discountPercentage:e.target.value})}/>
              
              {/* CAMBIO: 'onSale' (nuevo campo) */}
              <label style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <input type="checkbox" checked={nuevo.onSale} onChange={e=>setNuevo({...nuevo, onSale: e.target.checked})}/>
                ¿En oferta?
              </label>

              <div>
                {/* CAMBIO: 'imagen_url' -> 'imagenUrl' */}
                <input type="text" placeholder="Imagen URL" value={nuevo.imagenUrl}
                       onChange={e=>setNuevo({...nuevo, imagenUrl:e.target.value})}/>
                <input type="file" accept="image/*" onChange={(e)=> e.target.files?.[0] && subirImagen(e.target.files[0], (url)=>setNuevo({...nuevo, imagenUrl:url}))}/>
                {uploading && <p className="card-sub">Subiendo...</p>}
              </div>
            </div>

            <button className="btn btn-primary" style={{ marginTop:10 }} onClick={crearProducto}>Agregar Producto</button>
          </div>
        </div>

        {/* Stock crítico */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <h2 style={{ marginTop:0 }}>Productos con Stock Crítico</h2>
            {criticos.length === 0 ? (
              <p>No hay productos críticos.</p>
            ) : (
              <div className="grid">
                {criticos.map(p=>(
                  <div key={p.id} className="card" style={{ padding:12 }}>
                    <h3 style={{ marginTop:0 }}>{p.nombre}</h3>
                    <p>Stock: <strong>{p.stock}</strong></p>
                    <p>Precio: <Precio p={p.precio}/></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lista y edición */}
        <div className="card">
          <div className="card-body">
            <h2 style={{ marginTop:0 }}>Todos los Productos</h2>
            <div className="grid">
              {productos.map(p=>(
                <div key={p.id} className="card" style={{ padding:12 }}>
                  {editando?.id === p.id ? (
                    <>
                      <input value={editando.nombre} onChange={e=>setEditando({...editando, nombre:e.target.value})}/>
                      <input type="number" value={editando.precio} onChange={e=>setEditando({...editando, precio:e.target.value})}/>
                      <input type="number" value={editando.stock} onChange={e=>setEditando({...editando, stock:e.target.value})}/>
                      
                      {/* CAMBIO: Leer el ID desde el objeto 'categoria' */}
                      <select value={editando.categoria?.id || ''} onChange={e=>setEditando({...editando, categoria: categorias.find(c => c.id == e.target.value)})}>
                        <option value="">(Sin categoría)</option>
                        {categorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                      
                      {/* CAMBIO: 'discount_percentage' -> 'discountPercentage' */}
                      <input type="number" step="0.01" value={editando.discountPercentage ?? ''} onChange={e=>setEditando({...editando, discountPercentage:e.target.value})} placeholder="Descuento (0..1)"/>
                      
                      <label style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <input type="checkbox" checked={editando.onSale} onChange={e=>setEditando({...editando, onSale: e.target.checked})}/>
                        ¿En oferta?
                      </label>

                      {/* CAMBIO: 'imagen_url' -> 'imagenUrl' */}
                      <input value={editando.imagenUrl || ''} onChange={e=>setEditando({...editando, imagenUrl:e.target.value})} placeholder="Imagen URL"/>
                      <input type="file" accept="image/*" onChange={(e)=> e.target.files?.[0] && subirImagen(e.target.files[0], (url)=>setEditando({...editando, imagenUrl:url}))}/>
                      {uploading && <p className="card-sub">Subiendo...</p>}

                      <div style={{ display:'flex', gap:8, marginTop:8 }}>
                        <button className="btn btn-primary" onClick={guardarEdicion}>Guardar</button>
                        <button className="btn btn-ghost" onClick={()=>setEditando(null)}>Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 style={{ marginTop:0 }}>{p.nombre}</h3>
                      {/* CAMBIO: 'imagen_url' -> 'imagenUrl' */}
                      {p.imagenUrl && <img src={p.imagenUrl} alt={p.nombre} style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }}/>}
                      <p className="card-sub">Precio: <Precio p={p.precio}/></p>
                      <p className="card-sub">Stock: {p.stock}</p>
                      {/* CAMBIO: 'discount_percentage' -> 'discountPercentage' */}
                      {p.discountPercentage ? (
                        <p style={{ color:'var(--brand)', fontWeight:700 }}>
                          Descuento: {Math.round(p.discountPercentage * 100)}%
                        </p>
                      ) : null}

                      <div style={{ display:'flex', gap:8, marginTop:8 }}>
                        <button className="btn btn-primary" onClick={()=>setEditando(p)}>Editar</button>
                        <button className="btn btn-ghost" onClick={()=>eliminarProducto(p.id)}>Eliminar</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}