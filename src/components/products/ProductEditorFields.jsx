import React from 'react';

/**
 * Campos del formulario de producto (alta/edición), alineados con la API.
 */
const ProductEditorFields = ({ formData, onChange, categories, idPrefix = 'prod' }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  return (
    <div className="product-editor-fields">
      <div className="product-editor-grid">
        <div className="product-editor-group">
          <label htmlFor={`${idPrefix}-nombre`}>Nombre</label>
          <input id={`${idPrefix}-nombre`} name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="product-editor-group">
          <label htmlFor={`${idPrefix}-franquicia`}>Franquicia</label>
          <input id={`${idPrefix}-franquicia`} name="franquicia" value={formData.franquicia} onChange={handleChange} required />
        </div>
        <div className="product-editor-group">
          <label htmlFor={`${idPrefix}-precio`}>Precio (Bs.)</label>
          <input
            id={`${idPrefix}-precio`}
            type="number"
            step="0.01"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="product-editor-group">
          <label htmlFor={`${idPrefix}-stock`}>Stock</label>
          <input id={`${idPrefix}-stock`} type="number" name="stock" value={formData.stock} onChange={handleChange} required />
        </div>
        <div className="product-editor-group full">
          <label htmlFor={`${idPrefix}-imagen`}>URL de la imagen</label>
          <input id={`${idPrefix}-imagen`} name="imagen" value={formData.imagen} onChange={handleChange} required />
        </div>
        <div className="product-editor-group">
          <label htmlFor={`${idPrefix}-categoria`}>Categoría</label>
          <select id={`${idPrefix}-categoria`} name="categoriaId" value={formData.categoriaId} onChange={handleChange} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="product-editor-checkboxes">
          <label className="product-editor-checkbox">
            <input type="checkbox" name="oferta" checked={!!formData.oferta} onChange={handleChange} />
            En oferta
          </label>
          <label className="product-editor-checkbox">
            <input type="checkbox" name="destacado" checked={!!formData.destacado} onChange={handleChange} />
            Destacado
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductEditorFields;
