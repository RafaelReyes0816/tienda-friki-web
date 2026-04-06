import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import ProductEditorFields from '../../components/products/ProductEditorFields';
import { emptyProductForm, normalizeProductPayload } from '../../utils/productPayload';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import '../products/Products.css';
import './AdminProductPages.css';
import '../../components/products/ProductEditorFields.css';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(() => emptyProductForm([]));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await productService.getAllCategories();
        setCategories(cats);
        setFormData(emptyProductForm(cats));
      } catch (e) {
        setError('No se pudieron cargar las categorías.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!categories.length) {
      setError('No hay categorías en el sistema. Crea categorías desde el backend o un panel de categorías.');
      return;
    }
    setSaving(true);
    try {
      await productService.createProduct(normalizeProductPayload(formData));
      setSuccess('Producto creado correctamente.');
      setFormData(emptyProductForm(categories));
      setTimeout(() => navigate('/productos'), 1200);
    } catch (err) {
      setError('No se pudo crear el producto. Revisa los datos e intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="products-view container admin-product-page">
        <p className="admin-page-loading">Cargando formulario…</p>
      </div>
    );
  }

  return (
    <div className="products-view container admin-product-page">
      <header className="catalog-header">
        <h1>Agregar producto</h1>
        <p>Completa los datos del artículo. Se guardarán en la base de datos igual que en el catálogo público.</p>
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

        <form onSubmit={handleSubmit}>
          <ProductEditorFields formData={formData} onChange={setFormData} categories={categories} idPrefix="add-prod" />
          <div className="admin-product-actions-row">
            <Link to="/productos" className="btn btn-secondary">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving || !categories.length}>
              {saving ? 'Guardando…' : 'Guardar producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
