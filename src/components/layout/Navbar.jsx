import { ShoppingCart, LogOut, Package, PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const admin = user && isAdmin();
  const adminAddActive = location.pathname === '/admin/agregar-producto';
  const adminDeleteActive = location.pathname === '/admin/borrar-producto';

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          Tienda <span>Fiki</span>
        </Link>

        <nav>
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            Inicio
          </Link>
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
            <>
              <Link
                to="/admin/agregar-producto"
                className={`admin-nav-link ${adminAddActive ? 'active' : ''}`}
              >
                <PlusCircle size={20} className="nav-icon" /> Agregar producto
              </Link>
              <Link
                to="/admin/borrar-producto"
                className={`admin-nav-link ${adminDeleteActive ? 'active' : ''}`}
              >
                <Trash2 size={20} className="nav-icon" /> Borrar producto
              </Link>
            </>
          )}
        </nav>

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
