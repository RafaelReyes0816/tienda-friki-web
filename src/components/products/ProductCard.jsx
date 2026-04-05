import React, { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductModal from './ProductModal';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { nombre, imagen, precio, oferta, franquicia, stock } = product;
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <button 
              className="action-btn" 
              title="Ver detalles"
              onClick={() => setIsModalOpen(true)}
            >
              <Eye size={20} />
            </button>
            <button 
              className="action-btn primary" 
              title="Añadir al carrito" 
              disabled={stock === 0}
              onClick={() => addToCart(product)}
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
        <div className="product-info">
          <span className="product-franchise">{franquicia}</span>
          <h3 className="product-name">{nombre}</h3>
          <div className="product-price-row">
            <span className="product-price">Bs. {precio.toFixed(2)}</span>
            {stock === 0 && <span className="stock-out">Sin stock</span>}
          </div>
        </div>
      </div>

      <ProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
