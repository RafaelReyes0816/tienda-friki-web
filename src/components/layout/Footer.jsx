import React from 'react';
import { MessageCircle, MapPin, Clock, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer">
      <h2>¡Visítanos en Tarija!</h2>

      <div className="footer-content">
        {/* RF-23: Mapa de ubicación embebido (Tarija) */}
        <div className="footer-mapa">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.000000000000!2d-64.732!3d-21.534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9408a68888888888%3A0x8888888888888888!2sTarija%2C%20Bolivia!5e0!3m2!1ses!2sbo!4v1700000000000"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Tienda Fiki"
          >
          </iframe>
        </div>

        {/* RF-24: Información de contacto y redes sociales */}
        <div className="footer-info">
          <h3>Tienda Fiki - Tarija</h3>

          <div className="info-item">
            <strong>
              <MapPin size={16} /> Dirección
            </strong>
            Calle Luis de Fuentes y García, Centro - Tarija
          </div>

          <div className="info-item">
            <strong>
              <Phone size={16} /> WhatsApp
            </strong>
            <a href="https://wa.me/59177171505" target="_blank" rel="noopener noreferrer">77171505</a>
          </div>

          <div className="info-item">
            <strong>
              <Clock size={16} /> Horario
            </strong>
            Lunes a Sábado → 10:00 - 20:00<br />
            Domingo → 10:00 - 14:00
          </div>

          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter/X">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
          </div>

          {/* RF-22: Botón de contacto por WhatsApp */}
          <button className="btn-whatsapp-footer"
            onClick={() => window.open('https://wa.me/59177171505?text=¡Hola%21%20Vengo%20de%20la%20web%20de%20Tienda%20Fiki%20', '_blank')}>
            <MessageCircle size={20} />
            ¡Contáctanos por WhatsApp!
          </button>
        </div>
      </div>

      <p className="copyright">© 2026 Tienda Fiki - Todos los derechos reservados</p>
    </footer>
  );
};

export default Footer;
