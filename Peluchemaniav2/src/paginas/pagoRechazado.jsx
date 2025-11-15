// src/paginas/checkoutRechazado.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const fmt = (n) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(n || 0));

export default function CheckoutRechazado() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Defaults in case user enters directly
  const {
    items = [],
    total = 0,
    address = null,
    errorMessage = 'El pago fue rechazado por el proveedor.',
    attemptedAt = new Date().toISOString(),
  } = state || {};

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="center-card" style={{ maxWidth: 900, textAlign: 'left' }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Pago rechazado</h2>

        <div className="server-error-message" style={{ marginBottom: 16 }}>
          {errorMessage}
        </div>

        <p className="mb-2" style={{ color: 'var(--muted)' }}>
          Intento: {new Date(attemptedAt).toLocaleString()}
        </p>

        {/* Shipping address */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-body">
            <h3 className="card-title" style={{ marginTop: 0 }}>Dirección de Envío</h3>
            {address ? (
              <>
                <p className="mb-0"><strong>{address?.region}</strong>, {address?.comuna}</p>
                <p className="mb-0">
                  {address?.calle} {address?.depto ? `(${address?.depto})` : ''}
                </p>
              </>
            ) : (
              <p className="mb-0" style={{ color: 'var(--muted)' }}>
                No se indicó una dirección para este intento.
              </p>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-body">
            <h3 className="card-title" style={{ marginTop: 0 }}>Resumen del Carrito</h3>

            {items.length === 0 ? (
              <p className="mb-0" style={{ color: 'var(--muted)' }}>
                No encontramos productos asociados a este intento.
              </p>
            ) : (
              <>
                <div>
                  {items.map((it) => (
                    <div key={it.id} className="cart-item" style={{ padding: '.75rem 0', boxShadow: 'none' }}>
                      <img
                        src={it.imagen}
                        alt={it.nombre}
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{it.nombre}</div>
                        <div style={{ color: 'var(--muted)' }}>
                          {it.quantity} × {fmt(it.precio)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        {fmt(Number(it.precio || 0) * Number(it.quantity || 0))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-total" style={{ marginTop: 10 }}>
                  <span>Total</span>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>{fmt(total)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/checkout')}>
            Intentar nuevamente
          </button>
          <Link className="btn btn-primary" to="/carro">
            Volver al carrito
          </Link>
          <Link className="btn" to="/home">
            Volver a Home
          </Link>
        </div>
      </div>
    </div>
  );
}
