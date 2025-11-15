// src/paginas/ofertas.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../lib/api.js';


const formatPrice = (price) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

export default function Sales() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/productos/on-sale`);
        const json = await res.json();
        // --- ¡CAMBIO 1 AQUÍ! ---
        // La API de Spring envía un array directo, no json.data
        setItems(json || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container"><div className="center-card">Cargando ofertas…</div></div>;

  return (
    <div className="container main-content">
      <h1 className="mb-2">Ofertas</h1>
      {items.length === 0 ? (
        <div className="center-card">No hay productos en oferta por el momento.</div>
      ) : (
        <div className="grid">
          {items.map(p => {
            // --- ¡CAMBIO 2 AQUÍ! ---
            // Calculamos el precio final como en home.jsx
            const finalPrice = Math.round(Number(p.precio || 0) * (1 - Number(p.discountPercentage || 0)));
            
            return (
              <Link key={p.id} to={`/producto/${p.id}`} className="card">
                {/* --- ¡CAMBIO 3 AQUÍ! --- */}
                {/* Usamos 'imagenUrl' (camelCase) */}
                <img className="card-media" src={p.imagenUrl} alt={p.nombre} />
                <div className="card-body">
                  <h3 className="card-title">{p.nombre}</h3>
                  <div>
                    <div style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>
                      {formatPrice(p.precio)}
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--brand)', fontSize: '1.2rem' }}>
                      {/* --- ¡CAMBIO 4 AQUÍ! --- */}
                      {/* Mostramos el precio final calculado */}
                      {formatPrice(finalPrice)}
                    </div>
                    <div style={{ fontSize: '.9rem', color: 'var(--muted)' }}>
                      {/* --- ¡CAMBIO 5 AQUÍ! --- */}
                      {/* Usamos 'discountPercentage' (camelCase) */}
                      Descuento: {Math.round((p.discountPercentage || 0) * 100)}%
                    </div>
                  </div>
                </div>
                <div className="card-actions">
                  <span className="btn btn-primary">Ver Detalle</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}