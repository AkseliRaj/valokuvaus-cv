import React, { useState, useEffect } from 'react';
import './CategoryManager.css';

const CategoryManager = ({ isOpen, categories, onAddCategory, onDeleteCategory, onClose }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reset unsaved changes when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setHasUnsavedChanges(false);
      setShowConfirmation(false);
      setShowDeleteConfirmation(false);
      setCategoryToDelete(null);
    }
  }, [isOpen]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(newCategoryName.trim().length > 0);
  }, [newCategoryName]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      await onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setError('');
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await onDeleteCategory(categoryToDelete);
      setShowDeleteConfirmation(false);
      setCategoryToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      setShowDeleteConfirmation(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDeleteCategory = () => {
    setShowDeleteConfirmation(false);
    setCategoryToDelete(null);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmation(false);
    setNewCategoryName('');
    setHasUnsavedChanges(false);
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

  const handleInputChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="category-modal-overlay" onClick={handleBackdropClick}>
        <div className="category-modal">
          <div className="category-modal-header">
            <h2>Manage Categories</h2>
            <button 
              className="category-modal-close"
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          
          <div className="category-modal-content">
            <form onSubmit={handleAddCategory}>
              <div className="form-row">
                <div className="form-group">
                  <label>New Category Name</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="add-category-btn">
                    Add Category
                  </button>
                </div>
              </div>
            </form>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="categories-list">
              <h4>Existing Categories</h4>
              {categories.map(category => (
                <div key={category.id} className="category-item">
                  <span>{category.name}</span>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="delete-category-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Unsaved changes confirmation */}
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

      {/* Delete category confirmation */}
      {showDeleteConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Delete Category</h3>
            <p>Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="confirmation-actions">
              <button onClick={cancelDeleteCategory} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDeleteCategory} className="confirm-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryManager; 