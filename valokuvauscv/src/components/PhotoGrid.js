import React from 'react';
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

      {photos.map(photo => (
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
                onClick={() => onDelete(photo.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid; 