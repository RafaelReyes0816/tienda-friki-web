import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-view">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenidos a Tienda Fiki</h1>
          <p>Tu paraíso geek en Tarija. Encuentra los mejores peluches, figuras y posters.</p>
          <button className="btn-cta">Explorar Productos</button>
        </div>
      </section>

      <section className="seccion container">
        <h2>Productos Destacados</h2>
        <div className="placeholder-grid">
          <p>Cargando productos destacados...</p>
        </div>
      </section>

      <section className="seccion container">
        <h2>Novedades</h2>
        <div className="placeholder-grid">
          <p>Cargando novedades...</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
