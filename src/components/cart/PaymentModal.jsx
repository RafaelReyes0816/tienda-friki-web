import React, { useState } from 'react';
import { X, Banknote, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onConfirm, total, loading }) => {
  const [selectedMethod, setSelectedMethod] = useState('Efectivo');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const paymentMethods = [
    { id: 'Efectivo', label: 'Efectivo', icon: <Banknote size={24} />, description: 'Paga al momento de recibir o recoger tu pedido.' }
  ];

  const handleConfirm = async () => {
    if (!selectedMethod) return;
    
    // Ejecutar lógica de checkout
    const success = await onConfirm(selectedMethod);
    if (success) {
      setShowSuccess(true);
    }
  };

  if (showSuccess) {
    return (
      <div className="payment-modal-overlay">
        <div className="payment-modal success-view">
          <CheckCircle2 size={80} className="success-icon" />
          <h2>¡Compra Finalizada!</h2>
          <p>Tu pedido ha sido procesado con éxito. Puedes revisarlo en la sección de "Mis Pedidos".</p>
          <button className="btn btn-primary" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <header className="payment-header">
          <h3>Selecciona tu método de pago</h3>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </header>

        <div className="payment-total-banner">
          <span>Total a pagar:</span>
          <strong>Bs. {total.toFixed(2)}</strong>
        </div>

        <div className="payment-methods-list">
          {paymentMethods.map((method) => (
            <div 
              key={method.id} 
              className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="method-icon">{method.icon}</div>
              <div className="method-info">
                <span className="method-label">{method.label}</span>
                <p className="method-desc">{method.description}</p>
              </div>
              <div className="method-radio">
                <div className={`radio-circle ${selectedMethod === method.id ? 'checked' : ''}`}></div>
              </div>
            </div>
          ))}
        </div>

        <footer className="payment-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button 
            className="btn btn-primary" 
            disabled={!selectedMethod || loading}
            onClick={handleConfirm}
          >
            {loading ? (
              <><Loader2 className="spinner" size={20} /> Procesando...</>
            ) : (
              <>Confirmar Pago <ArrowRight size={20} /></>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PaymentModal;
