// src/components/common/Toast.jsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__icon">
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <p className="toast__message">{message}</p>
      <button className="toast__close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;