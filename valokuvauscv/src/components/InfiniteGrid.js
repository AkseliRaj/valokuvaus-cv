import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PhotoCard from './PhotoCard';
import { basePhotos } from '../data/photoData';
import './InfiniteGrid.css';

const InfiniteGrid = React.memo(({ gridConfig, getScrollPosition, setUpdateCallback }) => {
  const gridRef = useRef(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const lastScrollRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  // Update scroll position without triggering re-renders
  const updateScrollPosition = useCallback((newPosition) => {
    if (Math.abs(newPosition.x - lastScrollRef.current.x) > 5 || 
        Math.abs(newPosition.y - lastScrollRef.current.y) > 5) {
      lastScrollRef.current = newPosition;
      setScrollPosition(newPosition);
    }
  }, []);

  // Set up scroll callback
  useEffect(() => {
    setUpdateCallback(updateScrollPosition);
  }, [setUpdateCallback, updateScrollPosition]);

  // Calculate which photos should be visible based on viewport
  const visiblePhotos = useMemo(() => {
    const { photoWidth, photoHeight, gap, columns } = gridConfig;
    const cellWidth = photoWidth + gap;
    const cellHeight = photoHeight + gap;
    
    // Use a much larger buffer to ensure no cutoff
    const buffer = 8; // Significantly increased buffer
    
    // Calculate the visible area with extra padding
    const visibleLeft = -scrollPosition.x - (buffer * cellWidth);
    const visibleRight = -scrollPosition.x + viewport.width + (buffer * cellWidth);
    const visibleTop = -scrollPosition.y - (buffer * cellHeight);
    const visibleBottom = -scrollPosition.y + viewport.height + (buffer * cellHeight);
    
    // Calculate grid positions
    const startCol = Math.floor(visibleLeft / cellWidth);
    const endCol = Math.ceil(visibleRight / cellWidth);
    const startRow = Math.floor(visibleTop / cellHeight);
    const endRow = Math.ceil(visibleBottom / cellHeight);
    
    const visible = [];
    
    // Create photos for the extended visible area
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        // Only add one photo per cell for better performance
        const photoIndex = Math.abs(row + col) % basePhotos.length;
        const photo = basePhotos[photoIndex];
        
        visible.push({
          ...photo,
          id: `${row}-${col}-${photo.id}`,
          gridRow: row,
          gridCol: col,
          originalId: photo.id,
          style: {
            position: 'absolute',
            left: col * cellWidth,
            top: row * cellHeight,
            width: photoWidth,
            height: photoHeight
          }
        });
      }
    }
    
    return visible;
  }, [gridConfig, scrollPosition, viewport]);

  // Update viewport size with more accurate calculation
  useEffect(() => {
    const updateViewport = () => {
      // Use window dimensions for more reliable viewport calculation
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Direct DOM manipulation for transform
  useEffect(() => {
    if (gridRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        gridRef.current.style.transform = `translate(${scrollPosition.x}px, ${scrollPosition.y}px)`;
      });
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollPosition]);

  return (
    <div className="infinite-grid" ref={gridRef}>
      {visiblePhotos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} style={photo.style} />
      ))}
    </div>
  );
});

export default InfiniteGrid; 