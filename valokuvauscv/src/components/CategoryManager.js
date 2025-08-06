import React, { useState } from 'react';
import './CategoryManager.css';

const CategoryManager = ({ categories, onAddCategory, onDeleteCategory, onCancel }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

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
    } catch (err) {
      setError(err.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await onDeleteCategory(categoryId);
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="category-form">
      <h3>Manage Categories</h3>
      <form onSubmit={handleAddCategory}>
        <div className="form-row">
          <div className="form-group">
            <label>New Category Name</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
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

      <div className="category-actions">
        <button onClick={onCancel} className="cancel-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default CategoryManager; 