import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer">
      <h2>¡Visítanos en Tarija!</h2>

      <div className="footer-content">
        {/* MAPA */}
        <div className="footer-mapa">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.367374827295!2d-64.732597324099!3d-21.534592780266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9408a7a3e8f2d6b5%3A0x8f8f8f8f8f8f8f8f!2sCalle%20Luis%20de%20Fuentes%2C%20Tarija!5e0!3m2!1ses-419!2sbo!4v1700000000000"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Tienda Fiki"
          >
          </iframe>
        </div>

        {/* INFO */}
        <div className="footer-info">
          <h3>Tienda Fiki - Tarija</h3>

          <div className="info-item">
            <strong>Dirección</strong>
            Calle Luis de Fuentes y García, Centro - Tarija
          </div>

          <div className="info-item">
            <strong>WhatsApp</strong>
            <a href="https://wa.me/59177171505" target="_blank" rel="noopener noreferrer">77171505</a>
          </div>

          <div className="info-item">
            <strong>Horario</strong>
            Lunes a Sábado → 10:00 - 20:00<br />
            Domingo → 10:00 - 14:00
          </div>

          <button className="btn-whatsapp-footer"
            onClick={() => window.open('https://wa.me/59177171505?text=¡Hola%21%20Vengo%20de%20la%20web%20de%20Tienda%20Fiki%20', '_blank')}>
            ¡Contáctanos por WhatsApp!
          </button>
        </div>
      </div>

      <p className="copyright">© 2025 Tienda Fiki - Todos los derechos reservados</p>
    </footer>
  );
};

export default Footer;
