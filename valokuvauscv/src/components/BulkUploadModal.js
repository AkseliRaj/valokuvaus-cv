import React, { useState, useEffect } from 'react';
import BulkUploadForm from './BulkUploadForm';
import './BulkUploadModal.css';

const BulkUploadModal = ({ isOpen, onClose, categories, onUpload, onComplete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reset unsaved changes when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setHasUnsavedChanges(false);
      setShowConfirmation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  const cancelClose = () => {
    setShowConfirmation(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <div className="bulk-upload-modal-overlay" onClick={handleBackdropClick}>
        <div className="bulk-upload-modal">
          <div className="bulk-upload-modal-header">
            <h2>Bulk Upload Photos</h2>
            <button 
              className="bulk-upload-modal-close"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="bulk-upload-modal-content">
            <BulkUploadForm 
              categories={categories}
              onUpload={onUpload}
              onCancel={onClose}
              onUnsavedChanges={setHasUnsavedChanges}
              onComplete={onComplete}
            />
          </div>
        </div>
      </div>
      
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Unsaved Changes</h3>
            <p>You have unsaved changes. Are you sure you want to close without saving?</p>
            <div className="confirmation-actions">
              <button onClick={cancelClose} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmClose} className="confirm-btn">
                Close Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkUploadModal;
