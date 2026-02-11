import React from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="login-modal-overlay" onClick={handleOverlayClick}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            <path d="M12 1v6m0 0a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
        </div>
        
        <div className="login-modal-content">
          <h2 className="login-modal-title">{title}</h2>
          <p className="login-modal-message">{message}</p>
          
          <div className="login-modal-buttons">
            <button 
              className="login-modal-btn login-modal-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="login-modal-btn login-modal-btn-primary"
              onClick={onConfirm}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;