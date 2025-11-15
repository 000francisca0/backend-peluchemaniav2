// src/paginas/categoria.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard/productCard.jsx';
import { API_BASE } from '../lib/api.js';

export default function Categoria() {
  const { categoryId } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Esta URL /api/productos/category/... ¡AÚN NO EXISTE EN SPRING!
        // Seguirá dando error hasta que la creemos en el backend.
        const res = await fetch(`${API_BASE}/productos/category/${categoryId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error fetching');
        
        // --- CAMBIO 1: Quitar .data ---
        // Spring envía un array directo, no data.data
        setProductos(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryId]);

  return (
    <main className="main-content">
      <div className="container">
        <h1 className="productos-title">Categoría {categoryId}</h1>

        {loading && <p>Cargando productos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="grid" style={{ marginTop: 16 }}>
          {productos.length > 0 ? (
            productos.map(p => (
              // --- CAMBIO 2: p.imagenUrl (camelCase) ---
              <ProductCard key={p.id} producto={{ ...p, imagen: p.imagenUrl || p.imagen_url || p.imagen }} />
            ))
          ) : (
            <div className="card">
              <div className="card-body">
                <p>No hay productos en esta categoría.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}