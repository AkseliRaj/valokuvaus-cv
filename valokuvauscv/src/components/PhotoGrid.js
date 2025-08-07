import React, { useState, useEffect } from 'react';
import './PhotoGrid.css';

const PhotoGrid = ({ 
  photos, 
  onEdit, 
  onDelete, 
  showFilters, 
  onToggleFilters,
  filters,
  categories,
  onFilterChange,
  onClearFilters,
  totalCount
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const photosPerPage = 15;

  // Calculate pagination
  const totalPages = Math.ceil(photos.length / photosPerPage);
  const startIndex = (currentPage - 1) * photosPerPage;
  const endIndex = startIndex + photosPerPage;
  const currentPhotos = photos.slice(startIndex, endIndex);

  // Reset to first page when photos change
  useEffect(() => {
    setCurrentPage(1);
  }, [photos.length]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (photo) => {
    setPhotoToDelete(photo);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (photoToDelete) {
      onDelete(photoToDelete.id);
      setShowDeleteConfirmation(false);
      setPhotoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setPhotoToDelete(null);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const numberPages = [];
    const navigationButtons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      navigationButtons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-btn"
          data-type="nav"
        >
          ← Previous
        </button>
      );
    }

    // First page
    if (startPage > 1) {
      numberPages.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        numberPages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      numberPages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        numberPages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      numberPages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      navigationButtons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-btn"
          data-type="nav"
        >
          Next →
        </button>
      );
    }

    return (
      <>
        <div className="pagination-numbers">
          {numberPages}
        </div>
        {navigationButtons.length > 0 && (
          <div className="pagination-navigation">
            {navigationButtons}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="photos-grid">
      <div className="photos-header">
        <h3>Manage Photos ({photos.length} photos)</h3>
        <button 
          onClick={onToggleFilters}
          className="filter-toggle-btn"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="filter-section">
          <div className="filter-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by filename, camera, or category..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Photo Type</label>
              <select
                value={filters.photoType}
                onChange={(e) => onFilterChange('photoType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="color">Color</option>
                <option value="black_white">Black & White</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Camera</label>
              <input
                type="text"
                placeholder="Filter by camera model..."
                value={filters.camera}
                onChange={(e) => onFilterChange('camera', e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label>Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label>Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-actions">
            <button onClick={onClearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
            <span className="filter-results">
              Showing {photos.length} of {totalCount} photos
            </span>
          </div>
        </div>
      )}

      <div className="photos-container">
        {currentPhotos.map(photo => (
          <div key={photo.id} className="photo-item">
            <img 
              src={`http://localhost:5000/uploads/${photo.filename}`} 
              alt={photo.title || 'Photo'}
            />
            <div className="photo-info">
              <h4>Photo #{photo.id}</h4>
              <div className="photo-metadata">
                {photo.date && <span>Date: {photo.date}</span>}
                {photo.shutter_speed && <span>Shutter: {photo.shutter_speed}</span>}
                {photo.iso && <span>ISO: {photo.iso}</span>}
                {photo.focal_length && <span>Focal: {photo.focal_length}</span>}
                {photo.aperture && <span>Aperture: {photo.aperture}</span>}
                {photo.camera_info && <span>Camera: {photo.camera_info}</span>}
                <span>Type: {photo.is_black_white ? 'Black & White' : 'Color'}</span>
                {photo.category_name && <span>Category: {photo.category_name}</span>}
              </div>
              <div className="photo-actions">
                <button 
                  onClick={() => onEdit(photo)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClick(photo)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, photos.length)} of {photos.length} photos
          </div>
          <div className="pagination-controls">
            {renderPagination()}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this photo? This action cannot be undone.</p>
            <div className="confirmation-actions">
              <button onClick={cancelDelete} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid; 