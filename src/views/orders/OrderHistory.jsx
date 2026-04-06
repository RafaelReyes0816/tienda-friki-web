import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import { Package, Calendar, ChevronRight, ShoppingBag, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await orderService.getOrdersByUser(user.id);
      // Ordenar por fecha descendente
      setOrders(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <div className="orders-loading container">Cargando tu historial...</div>;

  if (orders.length === 0) {
    return (
      <div className="orders-view container">
        <div className="empty-orders">
          <ShoppingBag size={80} className="empty-icon" />
          <h1>Aún no tienes pedidos</h1>
          <p>Tus compras aparecerán aquí una vez que realices tu primer pedido.</p>
          <Link to="/productos" className="btn btn-primary">Ir a la Tienda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-view container">
      <header className="orders-header">
        <h1>Mis Pedidos</h1>
        <p>Gestiona y revisa el estado de tus compras.</p>
      </header>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header-info">
              <div className="order-main-info">
                <span className="order-code">#{order.codigo}</span>
                <span className={`order-status ${order.estado.toLowerCase()}`}>
                  {order.estado}
                </span>
              </div>
              <div className="order-meta">
                <span><Calendar size={14} /> {new Date(order.fecha).toLocaleDateString()}</span>
                <span><Package size={14} /> {order.detalles?.length || 0} artículos</span>
                <span className="order-payment-method">
                  <CreditCard size={14} /> Efectivo
                </span>
              </div>
            </div>

            <div className="order-items-preview">
              {order.detalles?.slice(0, 3).map((det, idx) => (
                <div key={idx} className="preview-item">
                  <img src={det.producto?.imagen} alt={det.producto?.nombre} title={det.producto?.nombre} />
                </div>
              ))}
              {(order.detalles?.length > 3) && (
                <div className="more-items">+{order.detalles.length - 3}</div>
              )}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span className="total-label">Total pagado</span>
                <span className="total-value">Bs. {order.total.toFixed(2)}</span>
              </div>
              <button className="btn-order-details">
                Ver detalles <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
