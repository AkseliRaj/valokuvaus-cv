import React from 'react';
import './FilterPanel.css';

const FilterPanel = ({ 
  filters, 
  categories, 
  onFilterChange, 
  onClearFilters, 
  filteredCount, 
  totalCount 
}) => {
  return (
    <div className="filter-form">
      <h3>Filter Photos</h3>
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
          Showing {filteredCount} of {totalCount} photos
        </span>
      </div>
    </div>
  );
};

export default FilterPanel; 