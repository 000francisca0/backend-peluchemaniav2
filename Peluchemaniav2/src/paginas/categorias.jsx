// src/paginas/categorias.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaFish, FaHatWizard } from 'react-icons/fa';
import { API_BASE } from '../lib/api.js';

const iconFor = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('oso')) return <FaPaw />;
  if (n.includes('fant')) return <FaHatWizard />;
  if (n.includes('mar')) return <FaFish />;
  return <FaPaw />;
};

export default function Categorias() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`${API_BASE}/categorias`);
      const data = await res.json();
      setCats(res.ok ? (data.data || []) : []);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="main-content">
      <div className="container">
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-body">
            <h1 style={{ margin: 0 }}>Categorías</h1>
            <p className="card-sub">Explora por tipo de peluche.</p>
          </div>
        </div>

        {loading ? (
          <div className="card">
            <div className="card-body">
              <p>Cargando...</p>
            </div>
          </div>
        ) : (
          <section className="grid">
            {cats.map((c) => (
              <Link
                key={c.id}
                to={`/categoria/${c.id}`}
                className="card"
                aria-label={c.nombre}
              >
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 42, opacity: 0.9, marginBottom: 8 }}>
                    {iconFor(c.nombre)}
                  </div>
                  <h3 className="card-title" style={{ textAlign: 'center' }}>
                    {c.nombre}
                  </h3>
                  <p className="card-sub">Ver productos de {c.nombre}</p>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
