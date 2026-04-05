import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      const orderData = {
        codigo: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        fecha: new Date().toISOString(),
        estado: 'Pendiente',
        total: cartTotal,
        usuarioId: user.id,
        metodoPago: 'Efectivo',
        detalles: cartItems.map(item => ({
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.precio,
          subtotal: item.precio * item.quantity
        }))
      };

      await orderService.createOrder(orderData);
      clearCart();
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al procesar la compra.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarCompra = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    handleCheckout();
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate('/pedidos');
  };

  if (showSuccess) {
    return (
      <div className="cart-view container">
        <div className="success-message">
          <CheckCircle2 size={80} className="success-icon" />
          <h1 className="success-title">¡Compra Exitosa!</h1>
          <p className="success-text">Tu pedido ha sido procesado con éxito. Puedes revisarlo en la sección de "Mis Pedidos".</p>
          <button className="btn btn-primary" onClick={handleCloseSuccess}>
            Ver Mis Pedidos
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-view container">
        <div className="empty-cart">
          <ShoppingBag size={80} className="empty-icon" />
          <h1>Tu carrito está vacío</h1>
          <p>¿Aún no has encontrado nada que te guste?</p>
          <Link to="/productos" className="btn btn-primary">
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-view container">
      <div className="cart-header">
        <h1>Tu Carrito de Compras</h1>
        <button onClick={clearCart} className="btn-clear-cart">
          Vaciar Carrito
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.imagen ? (
                  <img src={item.imagen} alt={item.nombre} />
                ) : (
                  <div className="image-placeholder">No Image</div>
                )}
              </div>
              <div className="item-details">
                <span className="item-franchise">{item.franquicia}</span>
                <h3 className="item-name">{item.nombre}</h3>
                <span className="item-price-unit">Bs. {item.precio.toFixed(2)} c/u</span>
              </div>
              <div className="item-quantity">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="qty-btn"
                >
                  <Minus size={16} />
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="qty-btn"
                  disabled={item.quantity >= item.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="item-subtotal">
                <span>Bs. {(item.precio * item.quantity).toFixed(2)}</span>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="btn-remove"
                title="Eliminar del carrito"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <div className="summary-card">
            <h3>Resumen del Pedido</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Bs. {cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span className="free-shipping">Gratis</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>Bs. {cartTotal.toFixed(2)}</span>
            </div>
            
            {error && <div className="cart-error">{error}</div>}

            <button 
              className="btn btn-primary checkout-btn" 
              onClick={handleFinalizarCompra}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="spinner" size={20} /> Procesando...</>
              ) : (
                <><ShoppingCart size={20} /> Finalizar Compra <ArrowRight size={20} /></>
              )}
            </button>
            <Link to="/productos" className="continue-shopping">
              Continuar comprando
            </Link>
          </div>
        </aside>
      </div>

    </div>
  );
};

export default Cart;
