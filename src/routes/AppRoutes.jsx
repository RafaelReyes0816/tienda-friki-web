import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../views/home/Home';
import Products from '../views/products/Products';
import Cart from '../views/cart/Cart';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import { useAuth } from '../hooks/useAuth';

// Ruta protegida para Admin
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin()) return <Navigate to="/login" />;
  return children;
};

// Vistas placeholder
const AdminDashboard = () => <div className="container seccion"><h1>Panel de Administración</h1><p>Bienvenido, Admin.</p></div>;

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        
        {/* Rutas Protegidas */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
