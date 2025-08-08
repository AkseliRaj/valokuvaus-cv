import React, { useState } from 'react';
import './InstructionsOverlay.css';

const InstructionsOverlay = ({ filterType, onFilterChange }) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const toggleFilter = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  return (
    <div className="instructions-overlay">
      <div className="instructions-content">
        <div className="instructions-header">
          <h2>Photography Portfolio</h2>
          <button 
            className={`filter-toggle-btn ${isFilterExpanded ? 'expanded' : ''}`}
            onClick={toggleFilter}
            aria-label="Toggle filter options"
          >
            <span className="arrow">▼</span>
          </button>
        </div>
        <p>Drag to scroll • Scroll wheel to zoom • Touch to navigate</p>
        
        {isFilterExpanded && (
          <div className="filter-section">
            <h3>Filter Photos</h3>
            <div className="filter-options">
              <button 
                className={`filter-btn ${filterType === 'colored' ? 'active' : ''}`}
                onClick={() => onFilterChange('colored')}
              >
                Colored
              </button>
              <button 
                className={`filter-btn ${filterType === 'black_white' ? 'active' : ''}`}
                onClick={() => onFilterChange('black_white')}
              >
                Black & White
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionsOverlay; 