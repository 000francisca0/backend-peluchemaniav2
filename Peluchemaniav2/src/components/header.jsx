// src/components/header.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import { useAuth } from '../context/AuthContext';
import { BsCart4 } from 'react-icons/bs';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/home');
  };

  return (
    <>
      <header className="header-fixed" role="banner">
        <div className="header-left">
          <Link to="/home" onClick={handleLinkClick}>
            <img src="/peluchemania.png" alt="Logo Peluchemania" className="logo" />
          </Link>
        </div>

        <nav className="nav" role="navigation" aria-label="Main navigation">
          <Link to="/home">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/categorias">Categorías</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/blog">Blog</Link>
          {/* Solo visible para admins */}
          {user?.rol === 'Administrador' && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="right-controls">
          {/* Desktop auth (mismas clases CSS tuyas) */}
          <div
            className="auth-links hidden-sm"
            aria-hidden={menuOpen}
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            {!isLoggedIn ? (
              <>
                <Link to="/inicio" className="btn btn-ghost" aria-label="Iniciar sesión">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  Regístrate
                </Link>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 700 }}>
                  {user?.nombre} {user?.apellidos}
                </span>
                <button className="btn btn-ghost" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            )}
          </div>

          {/* Carro (sin cambios) */}
          <div>
            <Link to="/carro" className="cart-link" aria-label="Carrito de compras" onClick={handleLinkClick}>
              <BsCart4 className="cart-icon" />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </Link>
          </div>

          {/* Toggle mobile */}
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
          >
            <span className={`bar ${menuOpen ? 'open' : ''}`} />
            <span className={`bar ${menuOpen ? 'open' : ''}`} />
            <span className={`bar ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </header>

      {/* Menú mobile */}
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link to="/home" onClick={handleLinkClick}>Inicio</Link>
          <Link to="/productos" onClick={handleLinkClick}>Productos</Link>
          <Link to="/categorias" onClick={handleLinkClick}>Categorías</Link>
          <Link to="/ofertas" onClick={handleLinkClick}>Ofertas</Link>
          <Link to="/nosotros" onClick={handleLinkClick}>Nosotros</Link>
          <Link to="/blog" onClick={handleLinkClick}>Blog</Link>

          {/* Solo para admins */}
          {user?.rol === 'Administrador' && (
            <Link to="/admin" onClick={handleLinkClick}>Admin</Link>
          )}

          <hr
            style={{
              width: '100%',
              border: 'none',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              margin: '8px 0'
            }}
          />

          {/* Auth en mobile */}
          {!isLoggedIn ? (
            <>
              <Link to="/inicio" onClick={handleLinkClick} className="btn">Iniciar sesión</Link>
              <Link to="/registro" onClick={handleLinkClick} className="btn">Regístrate</Link>
            </>
          ) : (
            <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
          )}

          <Link
            to="/carro"
            onClick={handleLinkClick}
            className="mobile-cart-link"
            style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <BsCart4 /> <span>Carrito ({totalItems})</span>
          </Link>
        </nav>
      )}
    </>
  );
}

export default Header;
