// src/admin/adminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaTags, FaUsers, FaReceipt, FaChartLine, FaUserCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';


const AdminTile = ({ to, icon, title, sub }) => (
  <Link to={to} className="card" style={{ textDecoration: 'none' }}>
    <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 12, alignItems: 'center' }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div>
        <h3 className="card-title" style={{ margin: 0 }}>{title}</h3>
        <div className="card-sub">{sub}</div>
      </div>
    </div>
  </Link>
);

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <main className="main-content">
      <div className="container">
        <div className="center-card">
          <h1 style={{ marginTop: 0 }}>Panel de Administración</h1>
          <p className="card-sub">Bienvenido, {user?.nombre} {user?.apellidos}.</p>
        </div>

        <section className="grid" style={{ marginTop: 16 }}>
          <AdminTile to="/admin/productos"   icon={<FaBox />}       title="Productos"   sub="CRUD, stock crítico y descuentos" />
          <AdminTile to="/admin/categorias"  icon={<FaTags />}      title="Categorías"  sub="Crear, renombrar y eliminar" />
          <AdminTile to="/admin/usuarios"    icon={<FaUsers />}     title="Usuarios"    sub="Perfiles, compras y edición" />
          <AdminTile to="/admin/boletas"     icon={<FaReceipt />}   title="Boletas"     sub="Historial y detalle de ventas" />
          <AdminTile to="/admin/reportes"    icon={<FaChartLine />} title="Reportes"    sub="Productos y ventas por periodo" />
          <AdminTile to="/admin/perfil"      icon={<FaUserCog />}   title="Mi Perfil"   sub="Datos del administrador" />
        </section>
      </div>
    </main>
  );
}
