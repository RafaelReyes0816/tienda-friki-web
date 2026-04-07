import { ShoppingCart, LogOut, Package, PlusCircle, Trash2, ClipboardList, FileBarChart } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef(null);
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const admin = user && isAdmin();
  const adminAddActive = location.pathname === '/admin/agregar-producto';
  const adminDeleteActive = location.pathname === '/admin/borrar-producto';
  const adminOrdersActive = location.pathname === '/admin/pedidos';
  const adminReportsActive = location.pathname === '/admin/reportes';
  const adminAnyActive = useMemo(
    () => adminAddActive || adminDeleteActive || adminOrdersActive || adminReportsActive,
    [adminAddActive, adminDeleteActive, adminOrdersActive, adminReportsActive]
  );

  useEffect(() => {
    setAdminMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onDown = (e) => {
      if (!adminMenuRef.current) return;
      if (!adminMenuRef.current.contains(e.target)) setAdminMenuOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <div className="navbar-left">
          <Link to="/" className="logo">
            Tienda <span>Fiki</span>
          </Link>

          <nav className="navbar-nav">
            {!admin && (
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Inicio
              </Link>
            )}
            <Link to="/productos" className={isActive('/productos') ? 'active' : ''}>
              Productos
            </Link>

            {user && !isAdmin() && (
              <>
                <Link to="/pedidos" className={isActive('/pedidos') ? 'active' : ''}>
                  <Package size={20} className="nav-icon" /> Mis Pedidos
                </Link>
                <Link to="/carrito" className={`cart-link ${isActive('/carrito') ? 'active' : ''}`}>
                  <ShoppingCart size={20} className="nav-icon" />
                  <span>Carrito</span>
                  <span id="contador-carrito">({cartCount})</span>
                </Link>
              </>
            )}

            {admin && (
              <div className="admin-menu" ref={adminMenuRef}>
                <button
                  type="button"
                  className={`admin-menu-trigger ${adminAnyActive ? 'active' : ''}`}
                  aria-haspopup="menu"
                  aria-expanded={adminMenuOpen}
                  onClick={() => setAdminMenuOpen((v) => !v)}
                >
                  <ClipboardList size={20} className="nav-icon" /> Administración
                </button>

                {adminMenuOpen && (
                  <div className="admin-menu-popover" role="menu">
                    <Link
                      to="/admin/reportes"
                      role="menuitem"
                      className={`admin-menu-item ${adminReportsActive ? 'active' : ''}`}
                    >
                      <FileBarChart size={18} className="nav-icon" /> Reportes
                    </Link>
                    <Link
                      to="/admin/agregar-producto"
                      role="menuitem"
                      className={`admin-menu-item ${adminAddActive ? 'active' : ''}`}
                    >
                      <PlusCircle size={18} className="nav-icon" /> Agregar producto
                    </Link>
                    <Link
                      to="/admin/borrar-producto"
                      role="menuitem"
                      className={`admin-menu-item ${adminDeleteActive ? 'active' : ''}`}
                    >
                      <Trash2 size={18} className="nav-icon" /> Borrar producto
                    </Link>
                    <Link
                      to="/admin/pedidos"
                      role="menuitem"
                      className={`admin-menu-item ${adminOrdersActive ? 'active' : ''}`}
                    >
                      <Package size={18} className="nav-icon" /> Gestionar pedidos
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        <div className="auth-buttons">
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hola, {user.nombre.split(' ')[0]}</span>
              <button onClick={handleLogout} className="logout-btn" title="Cerrar Sesión">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">Iniciar Sesión</Link>
              <Link to="/registro" className="register-btn">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
