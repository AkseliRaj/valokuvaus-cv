import React from 'react';
import './AdminActions.css';

const AdminActions = ({ 
  showUploadForm, 
  showCategoryForm, 
  showFilters,
  onToggleUpload, 
  onToggleCategories, 
  onToggleFilters 
}) => {
  return (
    <div className="admin-actions">
      <button 
        onClick={onToggleUpload}
        className="upload-btn"
      >
        {showUploadForm ? 'Cancel Upload' : 'Upload New Photo'}
      </button>
      <button 
        onClick={onToggleCategories}
        className="category-btn"
      >
        {showCategoryForm ? 'Cancel' : 'Manage Categories'}
      </button>
      <button 
        onClick={onToggleFilters}
        className="filter-btn"
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
    </div>
  );
};

export default AdminActions; 