import React, { useState, useEffect } from 'react';
import HeroCarousel from '../../components/home/HeroCarousel';
import ProductGrid from '../../components/products/ProductGrid';
import productService from '../../services/productService';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const allProducts = await productService.getAllProducts();
        
        // RF-04: Productos Destacados
        const featured = allProducts.filter(p => p.destacado).slice(0, 4);
        setFeaturedProducts(featured);
        
        // RF-05: Novedades (últimos 4 productos ingresados)
        // Asumiendo que los últimos IDs son los más nuevos
        const arrivals = [...allProducts].sort((a, b) => b.id - a.id).slice(0, 4);
        setNewArrivals(arrivals);
        
      } catch (error) {
        console.error("Error al cargar datos de inicio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-view">
      {/* RF-06: Carrusel rotativo */}
      <HeroCarousel />

      <div className="container">
        {/* RF-04: Sección de "Productos Destacados" */}
        <section className="home-section">
          <div className="section-header">
            <div className="section-title">
              <Sparkles className="icon-primary" />
              <h2>Productos Destacados</h2>
            </div>
            <Link to="/productos" className="view-all">
              Ver todo <ArrowRight size={18} />
            </Link>
          </div>
          <ProductGrid 
            products={featuredProducts} 
            loading={loading} 
            emptyMessage="No hay productos destacados en este momento."
          />
        </section>

        {/* Banner promocional intermedio */}
        <section className="promo-banner">
          <div className="promo-content">
            <h3>¿Buscas algo especial?</h3>
            <p>Explora nuestro catálogo completo con más de 500 artículos de tus franquicias favoritas.</p>
            <Link to="/productos" className="btn btn-secondary">Ver Catálogo Completo</Link>
          </div>
        </section>

        {/* RF-05: Sección de "Novedades" */}
        <section className="home-section">
          <div className="section-header">
            <div className="section-title">
              <Clock className="icon-primary" />
              <h2>Novedades</h2>
            </div>
            <Link to="/productos" className="view-all">
              Ver todo <ArrowRight size={18} />
            </Link>
          </div>
          <ProductGrid 
            products={newArrivals} 
            loading={loading} 
            emptyMessage="Próximamente nuevos ingresos."
          />
        </section>
      </div>
    </div>
  );
};

export default Home;
