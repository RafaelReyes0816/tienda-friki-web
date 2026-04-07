import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileDown, ClipboardList, Package } from 'lucide-react';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import { downloadPedidosPdf, downloadInventarioPdf } from '../../utils/reportPdf';
import './AdminReports.css';

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } catch (e) {
        if (!cancelled) {
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

  const totalVentas = useMemo(
    () => orders.reduce((acc, x) => acc + Number(x.total ?? 0), 0),
    [orders]
  );

  const stockTotal = useMemo(
    () => products.reduce((acc, x) => acc + Number(x.stock ?? 0), 0),
    [products]
  );

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
        <h1>Reportes</h1>
        <p>
          Resumen de pedidos e inventario. Descarga cada informe en PDF para archivarlo o compartirlo.
        </p>
      </header>

      {error && <p className="admin-reports-error">{error}</p>}

      <div className="admin-reports-grid">
        <div className="admin-report-stat">
          <span>Pedidos registrados</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="admin-report-stat">
          <span>Suma de totales (pedidos)</span>
          <strong>
            Bs.{' '}
            {totalVentas.toLocaleString('es-BO', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>
        <div className="admin-report-stat">
          <span>Productos en catálogo</span>
          <strong>{products.length}</strong>
        </div>
        <div className="admin-report-stat">
          <span>Unidades en stock (suma)</span>
          <strong>{stockTotal}</strong>
        </div>
      </div>

      <div className="admin-reports-actions">
        <button
          type="button"
          className="admin-reports-pdf-primary"
          disabled={orders.length === 0}
          onClick={() => downloadPedidosPdf(orders)}
        >
          <ClipboardList size={22} />
          Descargar PDF de pedidos
        </button>
        <button
          type="button"
          className="admin-reports-pdf-secondary"
          disabled={products.length === 0}
          onClick={() => downloadInventarioPdf(products)}
        >
          <Package size={22} />
          Descargar PDF de inventario
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.75 }}>
        <FileDown size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Los archivos se guardan con un nombre único según la fecha de generación.
      </p>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <Link to="/productos" className="back-link-admin-reports">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
};

export default AdminReports;
