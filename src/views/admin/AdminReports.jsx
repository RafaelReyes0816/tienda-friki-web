import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileDown, ClipboardList, Package, Filter, XCircle, AlertTriangle, TrendingUp, ShoppingBag } from 'lucide-react';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import { downloadPedidosPdf, downloadInventarioPdf } from '../../utils/reportPdf';
import './AdminReports.css';

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setError('');
      try {
        const [o, p] = await Promise.all([
          orderService.getAllOrders(),
          productService.getAllProducts(),
        ]);
        if (!cancelled) {
          setOrders(Array.isArray(o) ? o : []);
          setProducts(Array.isArray(p) ? p : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError('No se pudieron cargar los datos para los reportes.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Lógica de filtrado de pedidos
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.fecha).toISOString().split('T')[0];
      const matchesDate = (!dateRange.start || orderDate >= dateRange.start) && 
                          (!dateRange.end || orderDate <= dateRange.end);
      
      // Normalizar para comparación (case-insensitive)
      const orderStatus = (order.estado || '').toLowerCase();
      const filterStatus = statusFilter.toLowerCase();
      
      const matchesStatus = filterStatus === 'todos' || orderStatus === filterStatus;
      return matchesDate && matchesStatus;
    });
  }, [orders, dateRange, statusFilter]);

  // Lógica de filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = categoryFilter === 'Todas' || product.categoria?.nombre === categoryFilter;
      const matchesLowStock = !showLowStockOnly || product.stock <= 5;
      return matchesCategory && matchesLowStock;
    });
  }, [products, categoryFilter, showLowStockOnly]);

  const totalVentas = useMemo(
    () => filteredOrders.reduce((acc, x) => acc + Number(x.total ?? 0), 0),
    [filteredOrders]
  );

  const stockTotal = useMemo(
    () => filteredProducts.reduce((acc, x) => acc + Number(x.stock ?? 0), 0),
    [filteredProducts]
  );

  const lowStockCount = useMemo(
    () => products.filter(p => p.stock <= 5).length,
    [products]
  );

  const categories = useMemo(() => {
    const cats = products.map(p => p.categoria?.nombre).filter(Boolean);
    return ['Todas', ...new Set(cats)];
  }, [products]);

  const resetFilters = () => {
    setDateRange({ start: '', end: '' });
    setStatusFilter('Todos');
    setCategoryFilter('Todas');
    setShowLowStockOnly(false);
  };

  if (loading) {
    return (
      <div className="admin-reports-page container">
        <p className="admin-reports-loading">Cargando reportes…</p>
      </div>
    );
  }

  return (
    <div className="admin-reports-page container">
      <header className="admin-reports-header">
        <h1>Centro de Reportes</h1>
        <p>
          Analiza el rendimiento de tu tienda y gestiona el inventario con precisión.
        </p>
      </header>

      {error && <p className="admin-reports-error">{error}</p>}

      {/* Sección de Filtros */}
      <section className="reports-filters-section">
        <div className="filters-header">
          <Filter size={20} />
          <h3>Filtros de Reporte</h3>
          {(dateRange.start || dateRange.end || statusFilter !== 'Todos' || categoryFilter !== 'Todas' || showLowStockOnly) && (
            <button className="btn-reset-filters" onClick={resetFilters}>
              <XCircle size={16} /> Limpiar filtros
            </button>
          )}
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label>Desde:</label>
            <input 
              type="date" 
              value={dateRange.start} 
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})} 
            />
          </div>
          <div className="filter-group">
            <label>Hasta:</label>
            <input 
              type="date" 
              value={dateRange.end} 
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})} 
            />
          </div>
          <div className="filter-group">
            <label>Estado Pedido:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="en_proceso">En Proceso</option>
              <option value="enviado">Enviado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Categoría:</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="admin-reports-grid">
        <div className="admin-report-stat highlight">
          <div className="stat-icon"><ShoppingBag size={24} /></div>
          <div className="stat-content">
            <span>Pedidos Filtrados</span>
            <strong>{filteredOrders.length}</strong>
          </div>
        </div>
        <div className="admin-report-stat highlight-alt">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <span>Ingresos Totales</span>
            <strong>
              Bs.{' '}
              {totalVentas.toLocaleString('es-BO', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>
        </div>
        <div className="admin-report-stat">
          <div className="stat-icon"><Package size={24} /></div>
          <div className="stat-content">
            <span>Stock Total Filtrado</span>
            <strong>{stockTotal}</strong>
          </div>
        </div>
        <div className={`admin-report-stat ${lowStockCount > 0 ? 'warning' : ''}`}>
          <div className="stat-icon">
            {lowStockCount > 0 ? <AlertTriangle size={24} /> : <Package size={24} />}
          </div>
          <div className="stat-content">
            <span>Stock Crítico (&lt;5)</span>
            <strong>{lowStockCount}</strong>
          </div>
        </div>
      </div>

      <div className="admin-reports-actions">
        <button
          type="button"
          className="admin-reports-pdf-primary"
          disabled={filteredOrders.length === 0}
          onClick={() => downloadPedidosPdf(filteredOrders)}
        >
          <ClipboardList size={22} />
          Descargar PDF de pedidos filtrados
        </button>
        <button
          type="button"
          className="admin-reports-pdf-secondary"
          disabled={filteredProducts.length === 0}
          onClick={() => downloadInventarioPdf(filteredProducts)}
        >
          <Package size={22} />
          Descargar PDF de inventario filtrado
        </button>
        <button
          type="button"
          className={`admin-reports-pdf-warning ${lowStockCount === 0 ? 'disabled' : ''}`}
          disabled={lowStockCount === 0}
          onClick={() => {
            const lowStock = products.filter(p => p.stock <= 5);
            downloadInventarioPdf(lowStock);
          }}
        >
          <AlertTriangle size={22} />
          Reporte de Stock Crítico
        </button>
      </div>

      <p className="reports-footer-note">
        <FileDown size={18} />
        Los reportes generados respetarán los filtros seleccionados arriba.
      </p>

      <div className="reports-back-container">
        <Link to="/admin" className="back-link-admin-reports">
          ← Volver al Panel Admin
        </Link>
      </div>
    </div>
  );
};

export default AdminReports;
