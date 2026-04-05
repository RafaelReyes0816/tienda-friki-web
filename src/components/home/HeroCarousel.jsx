import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroCarousel.css';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=2070',
    title: 'Nuevas Figuras de Acción',
    description: 'Colecciona tus personajes favoritos de Marvel, DC y Anime.',
    buttonText: 'Ver Colección',
    link: '/productos'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80&w=2080',
    title: 'Especial Star Wars',
    description: 'Que la fuerza te acompañe con nuestra nueva línea de sables y cascos.',
    buttonText: 'Explorar Galaxia',
    link: '/productos'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070',
    title: 'Gaming & Setup',
    description: 'Mejora tu estación de juego con accesorios exclusivos.',
    buttonText: 'Ver Ofertas',
    link: '/productos'
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${slide.image})` }}
        >
          <div className="container">
            <div className="slide-content">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-description">{slide.description}</p>
              <a href={slide.link} className="btn btn-primary slide-btn">
                {slide.buttonText}
              </a>
            </div>
          </div>
        </div>
      ))}

      <button className="carousel-control prev" onClick={prevSlide}>
        <ChevronLeft size={32} />
      </button>
      <button className="carousel-control next" onClick={nextSlide}>
        <ChevronRight size={32} />
      </button>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
