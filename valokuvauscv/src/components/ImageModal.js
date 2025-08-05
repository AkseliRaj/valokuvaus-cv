import React, { useEffect } from 'react';
import './ImageModal.css';

const ImageModal = ({ isOpen, photo, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !photo) return null;

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>
          ×
        </button>
        <div className="image-modal-image-container">
          <img 
            src={photo.src} 
            alt={photo.alt}
            className="image-modal-image"
          />
        </div>
        <div className="image-modal-info">
          <h2>{photo.title}</h2>
          <p>{photo.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 