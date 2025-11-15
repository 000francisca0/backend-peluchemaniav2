import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../lib/api.js';

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
const fmt = (n) => CLP.format(Number(n || 0));

// ... (toda la función 'useAutoSlide' está perfecta, no se toca) ...
function useAutoSlide(length, delay = 4000) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, delay);
    return () => clearInterval(timerRef.current);
  }, [length, delay]);

  const goto = (i) => setIndex(((i % length) + length) % length);
  const next = () => goto(index + 1);
  const prev = () => goto(index - 1);

  const pause = () => timerRef.current && clearInterval(timerRef.current);
  const resume = () => {
    if (length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, delay);
  };

  return { index, goto, next, prev, pause, resume };
}


export default function Home() {
  const [onSale, setOnSale] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingSale, setLoadingSale] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorSale, setErrorSale] = useState('');
  const [errorCats, setErrorCats] = useState('');
  const navigate = useNavigate();

  // Load sale products
  useEffect(() => {
    (async () => {
      try {
        setLoadingSale(true);
        const res = await fetch(`${API_BASE}/productos/on-sale`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error cargando ofertas');
        
        // El JSON de Spring es un array directo, no json.data
        const data = (json || []).map(p => ({ // <-- CAMBIO 1: de 'json.data' a 'json'
          ...p,
          // La API de Spring usa 'imagenUrl' (camelCase)
          imagen: p.imagenUrl || p.imagen_url || p.imagen, // <-- CAMBIO 2: Añadido 'p.imagenUrl'
          // La API de Spring usa 'discountPercentage' (camelCase)
          finalPrice: p.discounted_price ?? Math.round(Number(p.precio || 0) * (1 - Number(p.discountPercentage || 0))) // <-- CAMBIO 3: de 'p.discount_percentage' a 'p.discountPercentage'
        }));
        setOnSale(data);
      } catch (e) {
        setErrorSale(e.message);
      } finally {
        setLoadingSale(false);
      }
    })();
  }, []);

  // Load categories
  useEffect(() => {
    (async () => {
      try {
        setLoadingCats(true);
        const res = await fetch(`${API_BASE}/categorias`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error cargando categorías');
        
        // El JSON de Spring es un array directo, no json.data
        setCategories(json || []); // <-- CAMBIO 4: de 'json.data' a 'json'
      } catch (e) {
        setErrorCats(e.message);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  const { index, goto, next, prev, pause, resume } = useAutoSlide(onSale.length, 4500);
  const current = useMemo(() => onSale[index] || null, [onSale, index]);

  return (
    // ... (todo el resto de tu código HTML/JSX está perfecto, no se toca) ...
    <main className="main-content">
      <div className="container">

        {/* ===================== HERO / CAROUSEL ===================== */}
        <section className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
          <div className="card-body" style={{ paddingBottom: 0 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h1 style={{ margin: 0 }}>¡Ofertas que abrigan el corazón!</h1>
              <Link to="/ofertas" className="btn btn-primary">Ver todas las ofertas</Link>
            </header>
          </div>

          <div onMouseEnter={pause} onMouseLeave={resume} style={{ position: 'relative' }}>
            {/* Slide */}
            <div className="home-hero-grid">
              {/* Media */}
              <div className="card home-hero-media" style={{ margin: 0, overflow: 'hidden', display: 'flex' }}>
                {loadingSale ? (
                  <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Cargando ofertas…
                  </div>
                ) : errorSale ? (
                  <div className="card-body" style={{ color: 'red' }}>{errorSale}</div>
                ) : current ? (
                  <button
                    onClick={() => navigate(`/producto/${current.id}`)}
                    style={{ border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', width: '100%', height: '100%' }}
                    aria-label={`Ver ${current.nombre}`}
                  >
                    <img
                      src={current.imagen}
                      alt={current.nombre}
                      className="card-media"
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ) : (
                  <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    No hay productos en oferta por ahora.
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="card" style={{ margin: 0, display: 'flex' }}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {current ? (
                    <>
                      <h2 className="card-title" style={{ fontSize: '1.6rem' }}>{current.nombre}</h2>
                      <p className="card-sub" style={{ marginBottom: 8 }}>
                        {current.descripcion || 'Un compañero suave que te acompañará siempre.'}
                      </p>

                      <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                        <span style={{ textDecoration: 'line-through', color: 'var(--muted)' }}>
                          {fmt(current.precio)}
                        </span>
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--brand)' }}>
                          {fmt(current.finalPrice)}
                        </span>
                        <span style={{ padding: '4px 8px', background: '#fff3f3', borderRadius: 8, fontWeight: 700 }}>
                          -{Math.round((current.discountPercentage || 0) * 100)}%
                        </span>
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                        <Link className="btn btn-ghost" to={`/producto/${current.id}`}>Ver detalle</Link>
                        <Link className="btn btn-primary" to="/ofertas">Más Ofertas</Link>
                      </div>
                    </>
                  ) : (
                    <div style={{ color: 'var(--muted)' }}>Revisa nuestras categorías y descubre más.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            {onSale.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Anterior"
                  className="btn btn-ghost"
                  onClick={prev}
                  style={{
                    position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)',
                    borderRadius: '50%', width: 44, height: 44, display: 'grid', placeItems: 'center'
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Siguiente"
                  className="btn btn-ghost"
                  onClick={next}
                  style={{
                    position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)',
                    borderRadius: '50%', width: 44, height: 44, display: 'grid', placeItems: 'center'
                  }}
                >
                  ›
                </button>
              </>
            )}

            {/* Dots */}
            {onSale.length > 1 && (
              <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', gap: 6, justifyContent: 'center' }}>
                {onSale.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Ir al slide ${i + 1}`}
                    onClick={() => goto(i)}
                    className="btn"
                    style={{
                      width: 10, height: 10, borderRadius: '50%',
                      padding: 0, border: '1px solid var(--brand)',
                      background: i === index ? 'var(--brand)' : 'transparent'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===================== CATEGORIES ===================== */}
        <section style={{ marginBottom: 24 }}>
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-body">
              <h2 style={{ margin: 0 }}>Explora por Categoría</h2>
              <p className="card-sub">Encuentra rápidamente tu peluche ideal.</p>
            </div>
          </div>

          {loadingCats ? (
            <div className="card"><div className="card-body">Cargando categorías…</div></div>
          ) : errorCats ? (
            <div className="card"><div className="card-body" style={{ color: 'red' }}>{errorCats}</div></div>
          ) : (
            <div className="grid">
              {categories.map(c => (
                <Link
                  key={c.id}
                  to={`/categoria/${c.id}`}
                  className="card"
                  aria-label={`Ir a categoría ${c.nombre}`}
                  style={{ textDecoration: 'none' }}
                >
                  <img
                    className="card-media"
                    alt={c.nombre}
                    src={
                      c.nombre.toLowerCase().includes('oso') ? '/osito.jpg'
                      : c.nombre.toLowerCase().includes('fantas') ? '/unicornio.jpg'
                      : '/panda.jpg'
                    }
                  />
                  <div className="card-body" style={{ textAlign: 'center' }}>
                    <h3 className="card-title" style={{ marginBottom: 0 }}>{c.nombre}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ===================== BLOG HIGHLIGHT ===================== */}
        <section>
          <div className="card">
            <div className="card-body home-blog-grid">
              <div>
                <h2 style={{ marginTop: 0, marginBottom: 6 }}>Consejos para cuidar tus peluches</h2>
                <p className="card-sub" style={{ marginBottom: 12 }}>
                  Aprende técnicas fáciles para mantener a tus amigos suaves como nuevos.
                </p>
                <Link to="/blog/cuidado-de-peluches" className="btn btn-primary">Leer el artículo</Link>
              </div>
              <img
                src="/conejo.jpg"
                alt="Cuidado de peluches"
                className="card-media"
                style={{ height: 220, objectFit: 'cover', borderRadius: 12 }}
              />
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}