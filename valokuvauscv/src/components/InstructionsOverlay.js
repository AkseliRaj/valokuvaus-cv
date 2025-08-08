import React, { useState, useEffect } from 'react';
import './InstructionsOverlay.css';

const InstructionsOverlay = ({ filterType, onFilterChange }) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleFilter = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  const handleFilterClick = (newFilterType) => {
    if (newFilterType !== filterType) {
      setIsAnimating(true);
      onFilterChange(newFilterType);
      
      // Remove animation class after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    }
  };

  return (
    <div className="instructions-overlay">
      <div className={`instructions-content ${isAnimating ? 'filter-changing' : ''}`}>
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
                onClick={() => handleFilterClick('colored')}
              >
                Colored
              </button>
              <button 
                className={`filter-btn ${filterType === 'black_white' ? 'active' : ''}`}
                onClick={() => handleFilterClick('black_white')}
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