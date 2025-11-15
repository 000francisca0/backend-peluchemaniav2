// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // { id, nombre, apellidos, email, rol, direccion_default }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.id && u?.rol) setCurrentUser(u);
        else localStorage.removeItem('currentUser');
      }
    } catch {
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = useMemo(
    () => ({
      user: currentUser,
      isLoggedIn: !!currentUser,
      role: currentUser?.rol || null,
      login,
      logout,
      loading,
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const RequireAuth = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;

  // 👇 --- ¡CAMBIO 1: AQUÍ ESTÁ EL ARREGLO! ---
  // Si no está logueado, redirige a "/inicio" (Login) en lugar de "/" (Home).
  if (!isLoggedIn) {
    return <Navigate to="/inicio" replace state={{ from: location }} />;
  }
  // --- FIN DEL CAMBIO ---

  return children;
};

export const RequireAdmin = ({ children }) => {
  const { isLoggedIn, role, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  
  // 👇 --- CAMBIO 2: También arreglamos esto ---
  // Redirige a "/inicio" si no está logueado
  if (!isLoggedIn) {
    return <Navigate to="/inicio" replace state={{ from: location }} />;
  }

  // 👇 --- CAMBIO 3: Redirige a "/" (Home) si no es admin ---
  // (En lugar de "/home" que ya no existe o es un redirect)
  if (role !== 'Administrador') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  // --- FIN DE LOS CAMBIOS ---
  
  return children;
};