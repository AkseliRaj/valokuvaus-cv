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

  // Add event listeners with proper options
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const wheelHandler = (e) => {
        e.preventDefault();
        handleWheel(e);
      };
      
      const touchStartHandler = (e) => {
        handleTouchStart(e);
      };
      
      const touchMoveHandler = (e) => {
        e.preventDefault();
        handleTouchMove(e);
      };
      
      const touchEndHandler = (e) => {
        handleTouchEnd(e);
      };
      
      // Use non-passive event listeners for wheel and touch events
      container.addEventListener('wheel', wheelHandler, { passive: false });
      container.addEventListener('touchstart', touchStartHandler, { passive: true });
      container.addEventListener('touchmove', touchMoveHandler, { passive: false });
      container.addEventListener('touchend', touchEndHandler, { passive: true });
      
      return () => {
        container.removeEventListener('wheel', wheelHandler);
        container.removeEventListener('touchstart', touchStartHandler);
        container.removeEventListener('touchmove', touchMoveHandler);
        container.removeEventListener('touchend', touchEndHandler);
      };
    }
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div 
      className="App"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
