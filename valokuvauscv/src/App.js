import React, { useRef, useEffect } from 'react';
import InfiniteGrid from './components/InfiniteGrid';
import InstructionsOverlay from './components/InstructionsOverlay';
import { useGridConfig } from './hooks/useGridConfig';
import { useDragScroll } from './hooks/useDragScroll';
import './App.css';

function App() {
  const containerRef = useRef(null);
  const gridConfig = useGridConfig();
  const {
    getScrollPosition,
    setUpdateCallback,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    cleanup
  } = useDragScroll();

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div 
      className="App"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <InfiniteGrid 
        gridConfig={gridConfig} 
        getScrollPosition={getScrollPosition}
        setUpdateCallback={setUpdateCallback}
      />
      <InstructionsOverlay />
    </div>
  );
}

export default App;
