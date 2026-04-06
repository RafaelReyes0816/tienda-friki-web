import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import ProductEditorFields from './ProductEditorFields';
import { normalizeProductPayload } from '../../utils/productPayload';
import './ProductEditorFields.css';
import './EditProductModal.css';

const EditProductModal = ({ product, categories, isOpen, onClose, onSaved }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setFormData({ ...product });
      setError('');
      setSuccess('');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await productService.updateProduct(product.id, normalizeProductPayload(formData));
      setSuccess('Cambios guardados.');
      onSaved?.();
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      setError('No se pudo guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-product-overlay" onClick={onClose}>
      <div className="edit-product-dialog" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="edit-product-close" onClick={onClose} aria-label="Cerrar">
          <X size={22} />
        </button>
        <h2 className="edit-product-title">Editar producto</h2>
        <p className="edit-product-subtitle">{product.nombre}</p>

        {error && (
          <div className="edit-product-alert edit-product-alert-error">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {success && (
          <div className="edit-product-alert edit-product-alert-success">
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <ProductEditorFields formData={formData} onChange={setFormData} categories={categories} idPrefix="edit-prod" />
          <div className="edit-product-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || !categories.length}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
