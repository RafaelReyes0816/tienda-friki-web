import React, { useState } from 'react';
import { ShoppingCart, Eye, Pencil } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import ProductModal from './ProductModal';
import EditProductModal from './EditProductModal';
import './ProductCard.css';

const ProductCard = ({ product, categories = [], onCatalogRefresh }) => {
  const { nombre, imagen, precio, oferta, franquicia, stock } = product;
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const admin = isAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const priceLabel = `Bs. ${Number(precio).toFixed(2)}`;

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          {imagen ? (
            <img src={imagen} alt={nombre} className="product-image" />
          ) : (
            <div className="product-image-placeholder">No Image</div>
          )}
          {oferta && <span className="badge-offer">Oferta</span>}
          <div className="product-actions">
            <button type="button" className="action-btn" title="Ver detalles" onClick={() => setIsModalOpen(true)}>
              <Eye size={20} />
            </button>
            {admin ? (
              <button
                type="button"
                className="action-btn action-btn-edit"
                title="Editar producto"
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil size={20} />
              </button>
            ) : (
              <button
                type="button"
                className="action-btn primary"
                title="Añadir al carrito"
                disabled={stock === 0}
                onClick={() => addToCart(product)}
              >
                <ShoppingCart size={20} />
              </button>
            )}
          </div>
        </div>
        <div className="product-info">
          <span className="product-franchise">{franquicia}</span>
          <h3 className="product-name">{nombre}</h3>
          <div className="product-price-row">
            <span className="product-price">{priceLabel}</span>
            {stock === 0 && <span className="stock-out">Sin stock</span>}
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdmin={admin}
        onRequestEdit={() => setIsEditOpen(true)}
      />

      {admin && (
        <EditProductModal
          product={product}
          categories={categories}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSaved={onCatalogRefresh}
        />
      )}
    </>
  );
};

export default ProductCard;
