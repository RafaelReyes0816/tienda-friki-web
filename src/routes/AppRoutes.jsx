import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../views/home/Home';
import Products from '../views/products/Products';
import Cart from '../views/cart/Cart';
import OrderHistory from '../views/orders/OrderHistory';
import AdminAddProduct from '../views/admin/AdminAddProduct';
import AdminDeleteProduct from '../views/admin/AdminDeleteProduct';
import AdminOrdersManagement from '../views/admin/AdminOrdersManagement';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin()) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/pedidos" element={<OrderHistory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route path="/admin" element={<Navigate to="/productos" replace />} />
        <Route
          path="/admin/agregar-producto"
          element={
            <AdminRoute>
              <AdminAddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/borrar-producto"
          element={
            <AdminRoute>
              <AdminDeleteProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <AdminRoute>
              <AdminOrdersManagement />
            </AdminRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
