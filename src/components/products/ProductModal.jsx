import React from 'react';
import { X, ShoppingCart, Star, Tag, Box, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const { nombre, imagen, precio, oferta, franquicia, stock, destacado } = product;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-content">
          <div className="modal-image-section">
            {imagen ? (
              <img src={imagen} alt={nombre} className="modal-image" />
            ) : (
              <div className="modal-image-placeholder">Sin imagen disponible</div>
            )}
            {oferta && <span className="modal-badge-offer">Oferta</span>}
            {destacado && <span className="modal-badge-featured">Destacado</span>}
          </div>

          <div className="modal-info-section">
            <div className="modal-header-info">
              <span className="modal-franchise">{franquicia}</span>
              <h2 className="modal-title">{nombre}</h2>
              <div className="modal-price">Bs. {precio.toFixed(2)}</div>
            </div>

            <div className="modal-details-grid">
              <div className="detail-item">
                <Box size={18} className="detail-icon" />
                <div className="detail-text">
                  <span className="detail-label">Stock disponible:</span>
                  <span className={`detail-value ${stock === 0 ? 'out-of-stock' : ''}`}>
                    {stock > 0 ? `${stock} unidades` : 'Agotado'}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <Tag size={18} className="detail-icon" />
                <div className="detail-text">
                  <span className="detail-label">Estado:</span>
                  <span className="detail-value">
                    {oferta ? '🔥 En Oferta' : 'Precio Regular'}
                  </span>
                </div>
              </div>

              <div className="detail-item full-width">
                <Info size={18} className="detail-icon" />
                <div className="detail-text">
                  <span className="detail-label">Descripción:</span>
                  <p className="detail-description">
                    Este es un producto oficial de la franquicia {franquicia}. 
                    Ideal para coleccionistas y fans. Calidad premium garantizada.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-primary modal-add-btn"
                disabled={stock === 0}
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
              >
                <ShoppingCart size={20} />
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
