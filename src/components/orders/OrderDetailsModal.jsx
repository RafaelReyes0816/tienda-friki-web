import { X, Package, Calendar, CreditCard, Hash, Info } from 'lucide-react';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="order-modal-header">
          <div className="header-title">
            <Package size={24} className="icon-title" />
            <h2>Detalles del Pedido</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className="order-modal-body">
          {/* Información General */}
          <section className="info-grid">
            <div className="info-item">
              <span className="info-label"><Hash size={14} /> Código</span>
              <span className="info-value">#{order.codigo}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Calendar size={14} /> Fecha</span>
              <span className="info-value">{new Date(order.fecha).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Info size={14} /> Estado</span>
              <span className={`status-badge ${order.estado.toLowerCase()}`}>
                {order.estado}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label"><CreditCard size={14} /> Pago</span>
              <span className="info-value">Efectivo</span>
            </div>
          </section>

          {/* Tabla de Productos */}
          <section className="products-table-section">
            <h3>Productos Comprados</h3>
            <div className="products-list">
              {order.detalles && order.detalles.length > 0 ? (
                order.detalles.map((detalle) => (
                  <div key={detalle.id} className="product-row">
                    <div className="product-img">
                      <img 
                        src={detalle.producto?.imagen || 'https://via.placeholder.com/50'} 
                        alt={detalle.producto?.nombre} 
                      />
                    </div>
                    <div className="product-details">
                      <span className="product-name">{detalle.producto?.nombre}</span>
                      <span className="product-qty">Cantidad: {detalle.cantidad}</span>
                    </div>
                    <div className="product-prices">
                      <span className="unit-price">Bs. {detalle.precioUnitario.toFixed(2)}</span>
                      <span className="subtotal">Bs. {detalle.subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-details">No hay detalles disponibles para este pedido.</p>
              )}
            </div>
          </section>
        </div>

        <footer className="order-modal-footer">
          <div className="total-summary">
            <span className="total-label">Total del Pedido</span>
            <span className="total-amount">Bs. {order.total.toFixed(2)}</span>
          </div>
          <button className="btn-close-footer" onClick={onClose}>Cerrar</button>
        </footer>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
