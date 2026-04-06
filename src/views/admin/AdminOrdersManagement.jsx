import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { AlertCircle, CheckCircle2, Eye, Package, Clock, CheckSquare, Truck, XCircle } from 'lucide-react';
import './AdminProductPages.css';

const AdminOrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente', icon: Clock, color: '#f59e0b' },
    { value: 'confirmado', label: 'Confirmado', icon: CheckSquare, color: '#10b981' },
    { value: 'en_proceso', label: 'En Proceso', icon: Package, color: '#3b82f6' },
    { value: 'enviado', label: 'Enviado', icon: Truck, color: '#8b5cf6' },
    { value: 'cancelado', label: 'Cancelado', icon: XCircle, color: '#ef4444' }
  ];

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      console.log('Pedidos recibidos del backend:', data);
      setOrders(data);
    } catch (e) {
      console.error('Error al obtener pedidos:', e);
      setError('No se pudo cargar la lista de pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
    setError('');
    setSuccess('');
  };

  const openStatusUpdate = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setStatusUpdateOpen(true);
    setError('');
    setSuccess('');
  };

  const performStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setError('');
    setSuccess('');
    setUpdating(true);
    
    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      setSuccess(`El estado del pedido #${selectedOrder.id} se actualizó correctamente.`);
      setStatusUpdateOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
      await fetchOrders();
    } catch (err) {
      console.error('Error completo:', err);
      if (err.message.includes('no soporta la actualización')) {
        setError('El backend no tiene la función para actualizar estados de pedidos. Esta funcionalidad debe ser implementada en el servidor.');
      } else if (err.response?.status === 400) {
        setError('Datos inválidos. Verifica el formato del pedido.');
      } else if (err.response?.status === 404) {
        setError('El pedido no fue encontrado en el servidor.');
      } else {
        setError('No se pudo actualizar el estado del pedido. Intenta de nuevo más tarde.');
      }
      setStatusUpdateOpen(false);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const pendingOrders = orders.filter(order => {
    const estado = order.estado || '';
    return estado.toLowerCase() === 'pendiente';
  });

  if (loading) {
    return (
      <div className="products-view container admin-product-page">
        <p className="admin-page-loading">Cargando pedidos…</p>
      </div>
    );
  }

  return (
    <div className="products-view container admin-product-page">
      <header className="catalog-header">
        <h1>Gestión de Pedidos</h1>
        <p>Administra los pedidos pendientes y actualiza su estado.</p>
      </header>

      <div className="admin-product-card">
        <Link to="/productos" className="back-link">
          ← Volver al catálogo
        </Link>

        {error && (
          <div className="admin-page-alert admin-page-alert-error">
            <AlertCircle size={20} /> {error}
          </div>
        )}
        {success && (
          <div className="admin-page-alert admin-page-alert-success">
            <CheckCircle2 size={20} /> {success}
          </div>
        )}

        <div className="admin-orders-section">
          <h2 className="admin-orders-title">
            Pedidos Pendientes ({pendingOrders.length})
          </h2>
          
          {pendingOrders.length === 0 ? (
            <p className="admin-orders-empty">No hay pedidos pendientes en este momento.</p>
          ) : (
            <div className="admin-orders-list">
              {pendingOrders.map((order) => {
                const StatusIcon = getStatusInfo(order.estado).icon;
                const statusColor = getStatusInfo(order.estado).color;
                
                return (
                  <div key={order.id} className="admin-order-item">
                    <div className="admin-order-info">
                      <div className="admin-order-header">
                        <span className="admin-order-id">#{order.id}</span>
                        <span 
                          className="admin-order-status"
                          style={{ color: statusColor }}
                        >
                          <StatusIcon size={16} />
                          {getStatusInfo(order.estado).label}
                        </span>
                      </div>
                      <div className="admin-order-details">
                        <p className="admin-order-customer">
                          <strong>Cliente:</strong> {order.usuario?.nombre || 'N/A'} {order.usuario?.apellido || ''}
                        </p>
                        <p className="admin-order-date">
                          <strong>Fecha:</strong> {formatDate(order.fecha || order.fecha_creacion)}
                        </p>
                        <p className="admin-order-total">
                          <strong>Total:</strong> Bs. {(order.total || calculateTotal(order.detalles)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="admin-order-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openOrderDetails(order)}
                      >
                        <Eye size={16} />
                        Ver más
                      </button>
                      <select
                        className="admin-status-select"
                        onChange={(e) => openStatusUpdate(order, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Cambiar estado</option>
                        {statusOptions
                          .filter(option => option.value !== 'pendiente')
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="admin-orders-section">
          <h2 className="admin-orders-title">
            Todos los Pedidos ({orders.length})
          </h2>
          
          {orders.length === 0 ? (
            <p className="admin-orders-empty">No hay pedidos registrados.</p>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => {
                const StatusIcon = getStatusInfo(order.estado).icon;
                const statusColor = getStatusInfo(order.estado).color;
                
                return (
                  <div key={order.id} className="admin-order-item">
                    <div className="admin-order-info">
                      <div className="admin-order-header">
                        <span className="admin-order-id">#{order.id}</span>
                        <span 
                          className="admin-order-status"
                          style={{ color: statusColor }}
                        >
                          <StatusIcon size={16} />
                          {getStatusInfo(order.estado).label}
                        </span>
                      </div>
                      <div className="admin-order-details">
                        <p className="admin-order-customer">
                          <strong>Cliente:</strong> {order.usuario?.nombre || 'N/A'} {order.usuario?.apellido || ''}
                        </p>
                        <p className="admin-order-date">
                          <strong>Fecha:</strong> {formatDate(order.fecha || order.fecha_creacion)}
                        </p>
                        <p className="admin-order-total">
                          <strong>Total:</strong> Bs. {(order.total || calculateTotal(order.detalles)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="admin-order-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openOrderDetails(order)}
                      >
                        <Eye size={16} />
                        Ver más
                      </button>
                      {order.estado !== 'cancelado' && (
                        <select
                          className="admin-status-select"
                          onChange={(e) => openStatusUpdate(order, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Cambiar estado</option>
                          {statusOptions
                            .filter(option => option.value !== order.estado)
                            .map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles del pedido */}
      {selectedOrder && detailsOpen && (
        <div className="modal-overlay">
          <div className="modal-content admin-order-details-modal">
            <div className="modal-header">
              <h3>Detalles del Pedido #{selectedOrder.id}</h3>
              <button 
                className="modal-close"
                onClick={() => setDetailsOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="order-details-section">
                <h4>Información del Cliente</h4>
                <p><strong>Nombre:</strong> {selectedOrder.usuario?.nombre || 'N/A'} {selectedOrder.usuario?.apellido || ''}</p>
                <p><strong>Email:</strong> {selectedOrder.usuario?.email || 'No especificado'}</p>
                <p><strong>Teléfono:</strong> {selectedOrder.usuario?.telefono || 'No especificado'}</p>
              </div>
              
              <div className="order-details-section">
                <h4>Información del Pedido</h4>
                <p><strong>Fecha:</strong> {formatDate(selectedOrder.fecha || selectedOrder.fecha_creacion)}</p>
                <p><strong>Estado:</strong> {getStatusInfo(selectedOrder.estado).label}</p>
                <p><strong>Código:</strong> {selectedOrder.codigo || `#${selectedOrder.id}`}</p>
                <p><strong>Dirección de entrega:</strong> {selectedOrder.direccion_entrega || 'No especificada'}</p>
              </div>
              
              <div className="order-details-section">
                <h4>Productos del Pedido</h4>
                <div className="order-items-list">
                  {selectedOrder.detalles.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <p className="item-name">{item.nombre}</p>
                        <p className="item-details">
                          {item.franquicia} · {item.categoria}
                        </p>
                      </div>
                      <div className="item-quantity-price">
                        <span className="item-quantity">x{item.cantidad}</span>
                        <span className="item-price">Bs. {item.precio.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <strong>Total: Bs. {(selectedOrder.total || calculateTotal(selectedOrder.detalles)).toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setDetailsOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de cambio de estado */}
      <ConfirmDialog
        isOpen={statusUpdateOpen}
        title="Cambiar Estado del Pedido"
        message={`Vas a cambiar el estado del pedido #${selectedOrder?.id} a "${getStatusInfo(newStatus).label}".`}
        detail="Esta acción actualizará el estado del pedido en el sistema."
        confirmLabel="Sí, cambiar estado"
        cancelLabel="No, cancelar"
        onCancel={() => !updating && setStatusUpdateOpen(false)}
        onConfirm={performStatusUpdate}
        loading={updating}
      />
    </div>
  );
};

export default AdminOrdersManagement;
