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

  const hasMetadata = photo.metadata && (
    photo.metadata.date ||
    photo.metadata.shutter_speed ||
    photo.metadata.iso ||
    photo.metadata.focal_length ||
    photo.metadata.aperture ||
    photo.metadata.camera_info ||
    photo.metadata.is_black_white ||
    photo.metadata.category_name
  );

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
          {hasMetadata && (
            <div className="image-modal-metadata">
              <h3>Photo Details</h3>
              <div className="metadata-grid">
                {photo.metadata.date && (
                  <div className="metadata-item">
                    <span className="metadata-label">Date:</span>
                    <span className="metadata-value">{photo.metadata.date}</span>
                  </div>
                )}
                {photo.metadata.shutter_speed && (
                  <div className="metadata-item">
                    <span className="metadata-label">Shutter Speed:</span>
                    <span className="metadata-value">{photo.metadata.shutter_speed}</span>
                  </div>
                )}
                {photo.metadata.iso && (
                  <div className="metadata-item">
                    <span className="metadata-label">ISO:</span>
                    <span className="metadata-value">{photo.metadata.iso}</span>
                  </div>
                )}
                {photo.metadata.focal_length && (
                  <div className="metadata-item">
                    <span className="metadata-label">Focal Length:</span>
                    <span className="metadata-value">{photo.metadata.focal_length}</span>
                  </div>
                )}
                {photo.metadata.aperture && (
                  <div className="metadata-item">
                    <span className="metadata-label">Aperture:</span>
                    <span className="metadata-value">{photo.metadata.aperture}</span>
                  </div>
                )}
                {photo.metadata.camera_info && (
                  <div className="metadata-item">
                    <span className="metadata-label">Camera:</span>
                    <span className="metadata-value">{photo.metadata.camera_info}</span>
                  </div>
                )}
                {photo.metadata.is_black_white !== undefined && (
                  <div className="metadata-item">
                    <span className="metadata-label">Type:</span>
                    <span className="metadata-value">{photo.metadata.is_black_white ? 'Black & White' : 'Color'}</span>
                  </div>
                )}
                {photo.metadata.category_name && (
                  <div className="metadata-item">
                    <span className="metadata-label">Category:</span>
                    <span className="metadata-value">{photo.metadata.category_name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 