import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { nombre, imagen, precio, oferta, franjicia, stock } = product;
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imagen ? (
          <img src={imagen} alt={nombre} className="product-image" />
        ) : (
          <div className="product-image-placeholder">No Image</div>
        )}
        {oferta && <span className="badge-offer">Oferta</span>}
        <div className="product-actions">
          <button className="action-btn" title="Ver detalles">
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
        <span className="product-franchise">{franjicia}</span>
        <h3 className="product-name">{nombre}</h3>
        <div className="product-price-row">
          <span className="product-price">${precio.toFixed(2)}</span>
          {stock === 0 && <span className="stock-out">Sin stock</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
