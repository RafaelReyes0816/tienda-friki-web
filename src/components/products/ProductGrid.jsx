import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, loading, emptyMessage = "No se encontraron productos", categories, onCatalogRefresh }) => {
  if (loading) {
    return (
      <div className="product-grid-loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categories={categories}
          onCatalogRefresh={onCatalogRefresh}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
