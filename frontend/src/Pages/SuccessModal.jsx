import React from 'react';
import './LoginModal.css'; // Uses the same CSS file

const SuccessModal = ({ isOpen, onClose, title, message, buttonText = "Close" }) => {
  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal success" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        
        <div className="login-modal-content">
          <h2 className="login-modal-title">{title}</h2>
          <p className="login-modal-message">{message}</p>
          
          <div className="login-modal-buttons">
            <button 
              className="login-modal-btn login-modal-btn-primary"
              onClick={onClose}
              style={{ background: 'linear-gradient(135deg, #c0a06a, #a88a58)' }}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;