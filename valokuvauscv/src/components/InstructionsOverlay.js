import React from 'react';
import './InstructionsOverlay.css';

const InstructionsOverlay = () => {
  return (
    <div className="instructions-overlay">
      <div className="instructions-content">
        <h2>Photography Portfolio</h2>
        <p>Drag to scroll • Scroll wheel to zoom • Touch to navigate</p>
      </div>
    </div>
  );
};

export default InstructionsOverlay; 