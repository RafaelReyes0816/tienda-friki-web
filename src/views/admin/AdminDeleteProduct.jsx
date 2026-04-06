import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import '../products/Products.css';
import './AdminProductPages.css';

const AdminDeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (e) {
      setError('No se pudo cargar la lista de productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const selected = useMemo(() => products.find((p) => String(p.id) === String(selectedId)), [products, selectedId]);

  const openConfirm = () => {
    if (!selectedId) {
      setError('Selecciona un producto de la lista.');
      return;
    }
    setError('');
    setSuccess('');
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    setError('');
    setSuccess('');
    setDeleting(true);
    try {
      await productService.deleteProduct(Number(selectedId));
      setSuccess('El producto se eliminó correctamente.');
      setSelectedId('');
      setConfirmOpen(false);
      await fetchProducts();
    } catch (err) {
      setError('No se pudo eliminar el producto. Intenta de nuevo más tarde.');
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="products-view container admin-product-page">
        <p className="admin-page-loading">Cargando productos…</p>
      </div>
    );
  }

  const productName = selected?.nombre || 'este producto';

  return (
    <div className="products-view container admin-product-page">
      <header className="catalog-header">
        <h1>Borrar producto</h1>
        <p>Elige un producto de la lista y confirma si deseas eliminarlo de la base de datos.</p>
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

        <div className="admin-delete-select-block">
          <label htmlFor="admin-delete-select">Producto a eliminar</label>
          <select
            id="admin-delete-select"
            className="admin-delete-select"
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setError('');
              setSuccess('');
            }}
          >
            <option value="">— Selecciona un producto —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} · Bs. {Number(p.precio).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {selected && (
          <>
            <div className="admin-delete-preview">
              {selected.imagen ? (
                <img src={selected.imagen} alt="" />
              ) : (
                <div className="admin-delete-thumb-placeholder" aria-hidden />
              )}
              <div className="meta">
                <strong>{selected.nombre}</strong>
                <span>
                  {selected.franquicia} · Stock: {selected.stock}
                </span>
              </div>
            </div>
            <p className="admin-delete-warning">
              Al confirmar, el producto se eliminará de forma permanente del catálogo y de la base de datos.
            </p>
          </>
        )}

        <div className="admin-product-actions-row">
          <Link to="/productos" className="btn btn-secondary">
            Cancelar
          </Link>
          <button type="button" className="btn btn-danger-delete" disabled={deleting || !selectedId} onClick={openConfirm}>
            <Trash2 size={18} />
            Eliminar producto
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Eliminar producto del catálogo"
        message={`Vas a eliminar «${productName}». Esta acción es permanente y no se puede deshacer.`}
        detail="El artículo dejará de mostrarse en la tienda y se eliminará del inventario en la base de datos."
        confirmLabel="Sí, eliminar definitivamente"
        cancelLabel="No, conservar"
        onCancel={() => !deleting && setConfirmOpen(false)}
        onConfirm={performDelete}
        loading={deleting}
      />
    </div>
  );
};

export default AdminDeleteProduct;
