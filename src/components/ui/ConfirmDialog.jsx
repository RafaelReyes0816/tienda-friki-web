import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

/**
 * Diálogo de confirmación acorde al tema (oscuro + acento), sustituye window.confirm.
 */
const ConfirmDialog = ({
  isOpen,
  title = 'Confirmar acción',
  message,
  detail,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="confirm-dialog-close" onClick={onCancel} aria-label="Cerrar">
          <X size={20} />
        </button>
        <div className={`confirm-dialog-icon confirm-dialog-icon--${variant}`} aria-hidden>
          <AlertTriangle size={28} />
        </div>
        <h2 id="confirm-dialog-title" className="confirm-dialog-title">
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="confirm-dialog-message">
          {message}
        </p>
        {detail ? <p className="confirm-dialog-detail">{detail}</p> : null}
        <div className="confirm-dialog-actions">
          <button type="button" className="btn btn-secondary confirm-dialog-btn" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn confirm-dialog-btn confirm-dialog-btn--${variant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Procesando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
