import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  
  const isActive = (path) => location.pathname === path;

  return (
    <header id="header">
      <div className="logo">
        <Link to="/">Tienda Fiki</Link>
      </div>
      
      <nav>
        <Link to="/" className={isActive('/') ? 'active' : ''}>Inicio</Link>
        <Link to="/productos" className={isActive('/productos') ? 'active' : ''}>Productos</Link>
        {user && !isAdmin() && (
          <Link to="/carrito" className={`cart-link ${isActive('/carrito') ? 'active' : ''}`}>
            <ShoppingCart size={20} className="nav-icon" />
            <span>Carrito</span>
            <span id="contador-carrito">({cartCount})</span>
          </Link>
        )}
        {isAdmin() && (
          <Link to="/admin" className={`admin-link ${isActive('/admin') ? 'active' : ''}`}>
            <Shield size={20} className="nav-icon" />
            <span>Admin</span>
          </Link>
        )}
      </nav>

      <div className="user-area">
        {user ? (
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user.nombre}</span>
              <span className="user-role">{user.rol}</span>
            </div>
            <button onClick={logout} className="btn-logout" title="Cerrar Sesión">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-auth">
              <User size={18} />
              <span>Entrar</span>
            </Link>
            <Link to="/registro" className="btn-register">
              Registro
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
