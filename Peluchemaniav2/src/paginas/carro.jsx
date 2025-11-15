import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Carro() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { cartItems, addToCart, removeFromCart, removeItem } = useContext(CartContext);

  // NOTA: Es importante que el breakpoint de isMobile (768px) coincida
  // con lo que consideras "móvil" en tu CSS/diseño.
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const mm = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mm.matches);
    if (mm.addEventListener) mm.addEventListener('change', handler);
    else mm.addListener(handler);
    return () => {
      if (mm.removeEventListener) mm.removeEventListener('change', handler);
      else mm.removeListener(handler);
    };
  }, []);

  const total = cartItems.reduce((sum, item) => {
    const precio = Number(item.precio || 0);
    const qty = Number(item.quantity || 0);
    return sum + precio * qty;
  }, 0);

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  const handleGoToCheckout = () => {
    if (!isLoggedIn || !user) {
      if (isMobile) {
        alert('Debes iniciar sesión para finalizar la compra.');
        navigate('/inicio');
      } else {
        setNotice('Debes iniciar sesión para finalizar la compra.');
      }
      return;
    }
    if (cartItems.length === 0) {
      if (!isMobile) setNotice('El carrito está vacío.');
      return;
    }
    setNotice('');
    navigate('/checkout');
  };

  // --- COMPONENTES DE RESUMEN ---
  
  // (Resumen para ESCRITORIO)
  const Summary = () => (
    <aside className={`summary card ${isMobile ? 'sticky-mobile' : ''}`}>
      <h2>Resumen de la Compra</h2>
      {notice && (
        <div className="server-error-message" style={{ marginBottom: 10 }}>
          {notice}
        </div>
      )}
      <div className="summary-section">
        <h3 style={{ fontSize: '1.1rem', marginTop: 0 }}>
          <FaMapMarkerAlt style={{ marginRight: 6 }} />
          Dirección de Envío
        </h3>
        {!isLoggedIn && (
          <p style={{ color: 'var(--muted)' }}>
            <Link to="/inicio" style={{ fontWeight: 700 }}>Inicia sesión</Link> para ver tu dirección.
          </p>
        )}
        
        {/* Usamos 'direccionDefault' (camelCase) que viene de la API de Spring */}
        {isLoggedIn && user?.direccionDefault && (
          <div className="address-info">
            <p className="mb-0">
              <strong>{user.direccionDefault.region}</strong>, {user.direccionDefault.comuna}
            </p>
            <p className="mb-0">
              {user.direccionDefault.calle} {user.direccionDefault.depto ? `(${user.direccionDefault.depto})` : ''}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--brand-hover)' }}>
              *Dirección registrada.
            </p>
          </div>
        )}
        {isLoggedIn && !user?.direccionDefault && (
          <p style={{ color: 'red' }}>Error: No hay dirección registrada.</p>
        )}
      </div>
      <hr className="my-3" />
      <div className="summary-section">
        <div className="summary-total">
          <span style={{ fontWeight: 700 }}>Total a Pagar</span>
          <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>{formatPrice(total)}</span>
        </div>
      </div>
      <button
        className="btn btn-primary btn-block"
        onClick={handleGoToCheckout}
        disabled={cartItems.length === 0 || !isLoggedIn}
        style={{ marginTop: 12 }}
      >
        Ir a Checkout
      </button>
    </aside>
  );

  // (Barra fija para MÓVIL)
  const MobileSummaryBar = () => (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      backgroundColor: 'var(--card-bg, #fff)',
      padding: '1rem',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000, display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', gap: '1rem'
    }}>
      <div>
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem', display: 'block' }}>Total</span>
        <strong style={{ fontSize: '1.3rem', color: 'var(--text, #000)' }}>{formatPrice(total)}</strong>
      </div>
      <button
        className="btn btn-primary"
        onClick={handleGoToCheckout}
        disabled={cartItems.length === 0 || !isLoggedIn}
        style={{ minWidth: '140px', flexShrink: 0 }}
      >
        Ir a Checkout
      </button>
    </div>
  );

  // --- RENDERIZADO PRINCIPAL ---

  return (
    <div className="cart-layout main-content" style={{ paddingBottom: isMobile ? '120px' : '0' }}>
      <div className="container">
        <h1 className="mb-2">Tu Carrito de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p>Tu carrito está vacío.</p>
            <Link to="/productos" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div>
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="cart-item" 
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    // CAMBIO CLAVE: Envuelve el contenido en móvil (fila 1: img+info, fila 2: controles)
                    flexWrap: isMobile ? 'wrap' : 'nowrap', 
                    alignItems: isMobile ? 'flex-start' : 'center', 
                    padding: '1rem',
                    borderBottom: '1px solid #eee' 
                  }}
                >
                  
                  {/* 2. Imagen del ítem */}
                  <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    className="cart-item-img"
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      // En móvil, la imagen va a la izquierda
                      marginRight: isMobile ? '0' : '1rem'
                    }} 
                  />

                  {/* 3. La información del producto */}
                  <div 
                    className="cart-item-info" 
                    style={{ 
                      flexGrow: 1, 
                      padding: isMobile ? '0 0 0 1rem' : '0 1rem',
                      // En móvil, ocupa el espacio restante en la primera fila (junto a la imagen)
                      width: isMobile ? 'calc(100% - 100px - 1rem)' : 'auto', 
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minHeight: isMobile ? '100px' : 'auto', // Para alinear con la imagen en móvil
                    }}
                  >
                    <span className="cart-item-name" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.nombre}</span>
                    <span className="cart-item-price-unit">{formatPrice(item.precio)} c/u</span>
                  </div>

                  {/* 4. BLOQUE DE CONTROLES COMPLETO */}
                  <div className="cart-item-controls-group" 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.5rem', 
                      // CAMBIO CLAVE: Si es móvil, ocupa 100% (salta a la segunda fila)
                      width: isMobile ? '100%' : 'auto', 
                      // Alineación en móvil a la izquierda
                      alignItems: isMobile ? 'flex-start' : 'flex-end', 
                      minWidth: isMobile ? 'auto' : '150px',
                      paddingTop: isMobile ? '1rem' : '0',
                      borderTop: isMobile ? '1px dashed #eee' : 'none',
                      marginTop: isMobile ? '1rem' : '0'
                    }}
                  >

                    {/* Controles de Cantidad */}
                    <div className="qty-controls" 
                        style={{ 
                          // Aseguramos que los controles de cantidad estén alineados
                          alignSelf: isMobile ? 'flex-start' : 'auto', 
                          display: 'flex', 
                          alignItems: 'center' 
                        }}>
                      <button
                        onClick={() => { setNotice(''); removeFromCart(item); }}
                        className="btn" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '1rem' }}
                        aria-label={`Reducir cantidad de ${item.nombre}`}
                      >
                        -
                      </button>
                      <span aria-live="polite" style={{ minWidth: 26, textAlign: 'center' }}>{item.quantity || 0}</span>
                      <button
                        onClick={() => { setNotice(''); addToCart(item); }}
                        className="btn"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '1rem' }}
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="cart-item-subtotal">
                       {isMobile && <span style={{ marginRight: '0.5rem', color: 'var(--muted)' }}>Subtotal:</span>}
                      <strong style={{ fontSize: '1.1rem' }}>
                        {formatPrice(Number(item.precio || 0) * Number(item.quantity || 0))}
                      </strong>
                    </div>

                    {/* Botón Eliminar */}
                    <div style={{ alignSelf: isMobile ? 'flex-start' : 'auto' }}>
                      <button
                        className="btn" 
                        style={{ 
                          padding: '0.25rem', 
                          fontSize: '0.85rem', 
                          color: 'var(--muted)', 
                          background: 'transparent', 
                          border: 'none',
                          textDecoration: 'underline'
                        }}
                        onClick={() => { setNotice(''); removeItem(item); }}
                        aria-label={`Eliminar ${item.nombre} del carrito`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div> 
                  {/* --- Fin del div de controles --- */}
                </div> // Fin de cart-item
              ))}
            </div>
            {/* Resumen (Desktop) */}
            {!isMobile && <Summary />}
          </div>
        )}
      </div>

      {/* Barra Fija (Móvil) */}
      {isMobile && cartItems.length > 0 && <MobileSummaryBar />}
    </div>
  );
}

// --- ¡CAMBIO AQUÍ! ---
// Eliminamos el 'export default Carro;' duplicado que estaba aquí y causaba el error.
export default Carro;