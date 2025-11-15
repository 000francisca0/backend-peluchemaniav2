// src/paginas/detallesProductos.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { API_BASE } from '../lib/api.js';

export default function DetallesProductos() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(n || 0));

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/productos/${id}/details`)
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error fetching product');

        const raw = data.data || {};
        const imgs = raw.images && raw.images.length ? raw.images : [raw.imagen_url || raw.imagen];
        setProducto({
          ...raw,
          images: imgs,
          imagen: imgs[0] || raw.imagen_url || raw.imagen,
        });
        setSelectedImage(imgs[0] || raw.imagen_url || raw.imagen || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <main className="main-content"><div className="container"><p>Cargando producto...</p></div></main>;
  if (error) return <main className="main-content"><div className="container"><p style={{ color: 'red' }}>{error}</p></div></main>;
  if (!producto) return <main className="main-content"><div className="container"><p>Producto no encontrado.</p></div></main>;

  const hasDiscount = Number(producto.discount_percentage || 0) > 0;
  const finalPrice = hasDiscount
    ? (producto.discounted_price ??
        Math.round(Number(producto.precio || 0) * (1 - Number(producto.discount_percentage || 0))))
    : Number(producto.precio || 0);

  const handleAddToCart = () => {
    const cartProduct = {
      id: producto.id,
      nombre: producto.nombre,
      precio: finalPrice, // Usa el precio con descuento si aplica
      imagen: producto.imagen || producto.imagen_url || (producto.images && producto.images[0]) || '/placeholder.jpg',
      stock: Number(producto.stock || 0),
    };
    addToCart(cartProduct);
  };

  return (
    <main className="main-content">
      <div className="container">
        <article className="card" aria-label={producto.nombre}>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
              {/* Left: gallery */}
              <div>
                <div className="card">
                  {selectedImage ? (
                    <img src={selectedImage} alt={producto.nombre} className="card-media" />
                  ) : (
                    <div className="card-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                      Sin imagen
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {producto.images && producto.images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(img)} className="btn" type="button" aria-label={`Imagen ${i + 1}`}>
                      <img src={img} alt={`${producto.nombre}-thumb-${i}`} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '8px' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: info */}
              <div>
                <h1 style={{ marginTop: 0 }}>{producto.nombre}</h1>
                <p className="card-sub">{producto.descripcion}</p>

                {/* Precio (con descuento si aplica) */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                  {hasDiscount ? (
                    <div>
                      <div style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>
                        {fmt(producto.precio)}
                      </div>
                      <div style={{ fontWeight: 900, color: 'var(--brand)', fontSize: '1.4rem' }}>
                        {fmt(finalPrice)}
                      </div>
                      <div style={{ fontSize: '.9rem', color: 'var(--muted)' }}>
                        Ahorro: {Math.round(Number(producto.discount_percentage || 0) * 100)}%
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand)' }}>
                      {fmt(producto.precio)}
                    </span>
                  )}

                  {/* Conserva tu pill si estaba presente */}
                  {Number(producto.on_sale) === 1 || hasDiscount ? (
                    <span style={{ padding: '4px 8px', background: '#fff3f3', borderRadius: 6, fontWeight: 700 }}>
                      En oferta
                    </span>
                  ) : null}
                </div>

                <p style={{ marginTop: 12 }}><strong>Stock:</strong> {producto.stock}</p>

                <div style={{ marginTop: 18 }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddToCart}
                    disabled={Number(producto.stock || 0) <= 0}
                  >
                    {Number(producto.stock || 0) > 0 ? 'Agregar al carrito' : 'Sin stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
