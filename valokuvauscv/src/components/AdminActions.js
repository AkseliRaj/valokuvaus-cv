import React from 'react';
import './AdminActions.css';

const AdminActions = ({ 
  showUploadForm, 
  showCategoryForm,
  onToggleUpload, 
  onToggleBulkUpload,
  onToggleCategories
}) => {
  return (
    <div className="admin-actions">
      <button 
        onClick={onToggleUpload}
        className="upload-btn"
      >
        Upload New Photo
      </button>
      <button 
        onClick={onToggleBulkUpload}
        className="bulk-upload-btn"
      >
        Bulk Upload Photos
      </button>
      <button 
        onClick={onToggleCategories}
        className="category-btn"
      >
        {showCategoryForm ? 'Cancel' : 'Manage Categories'}
      </button>
    </div>
  );
};

export default AdminActions; 