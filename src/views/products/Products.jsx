import React, { useState, useEffect, useMemo } from 'react';
import productService from '../../services/productService';
import ProductGrid from '../../components/products/ProductGrid';
import SearchBar from '../../components/products/SearchBar';
import CategoryFilter from '../../components/products/CategoryFilter';
import { Filter } from 'lucide-react';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        productService.getAllCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error al cargar el catálogo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // RF-02 y RF-03: Filtrado lógico en tiempo real
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === null || product.categoriaId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="products-view container">
      <div className="catalog-header">
        <h1>Nuestro Catálogo</h1>
        <p>Explora todos nuestros productos y encuentra tu próximo tesoro.</p>
      </div>

      <div className="catalog-controls">
        {/* RF-02: Búsqueda en tiempo real */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        
        <button 
          className="mobile-filter-toggle"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter size={20} />
          Filtros
        </button>
      </div>

      <div className="catalog-layout">
        {/* RF-03: Filtro por categoría */}
        <aside className={`catalog-sidebar ${showMobileFilters ? 'show' : ''}`}>
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => {
              setSelectedCategory(id);
              setShowMobileFilters(false);
            }}
          />
        </aside>

        <main className="catalog-main">
          <div className="results-info">
            <p>Mostrando {filteredProducts.length} productos</p>
          </div>
          
          {/* RF-01: Grid de productos con cards detalladas */}
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            categories={categories}
            onCatalogRefresh={fetchData}
            emptyMessage={
              searchTerm
                ? `No se encontraron resultados para "${searchTerm}"`
                : 'No hay productos disponibles en esta categoría.'
            }
          />
        </main>
      </div>
    </div>
  );
};

export default Products;
