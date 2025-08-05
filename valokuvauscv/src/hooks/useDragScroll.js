import { useState, useRef, useCallback } from 'react';

export const useDragScroll = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const updateCallbackRef = useRef(null);

  // Use ref for scroll position to avoid re-renders
  const setScrollPosition = useCallback((newPosition) => {
    scrollPositionRef.current = newPosition;
    if (updateCallbackRef.current) {
      updateCallbackRef.current(newPosition);
    }
  }, []);

  // Throttled update function using requestAnimationFrame
  const throttledUpdate = useCallback((newPosition) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setScrollPosition(newPosition);
    });
  }, [setScrollPosition]);

  // Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({
      x: e.clientX - scrollPositionRef.current.x,
      y: e.clientY - scrollPositionRef.current.y
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const now = performance.now();
    if (now - lastUpdateRef.current < 32) return; // ~30fps throttling
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate drag distance
    const distance = Math.sqrt(
      Math.pow(e.clientX - (dragStart.x + scrollPositionRef.current.x), 2) +
      Math.pow(e.clientY - (dragStart.y + scrollPositionRef.current.y), 2)
    );
    setDragDistance(distance);
    
    throttledUpdate({ x: newX, y: newY });
    lastUpdateRef.current = now;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Keep drag distance for a short time to prevent click events
    setTimeout(() => setDragDistance(0), 100);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({
      x: touch.clientX - scrollPositionRef.current.x,
      y: touch.clientY - scrollPositionRef.current.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Calculate drag distance for touch
    const distance = Math.sqrt(
      Math.pow(touch.clientX - (dragStart.x + scrollPositionRef.current.x), 2) +
      Math.pow(touch.clientY - (dragStart.y + scrollPositionRef.current.y), 2)
    );
    setDragDistance(distance);
    
    throttledUpdate({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Keep drag distance for a short time to prevent click events
    setTimeout(() => setDragDistance(0), 100);
  };

  // Wheel event for zoom-like scrolling
  const handleWheel = (e) => {
    const deltaX = e.deltaX || 0;
    const deltaY = e.deltaY || 0;
    
    const newPosition = {
      x: scrollPositionRef.current.x - deltaX,
      y: scrollPositionRef.current.y - deltaY
    };
    setScrollPosition(newPosition);
  };

  // Cleanup animation frame on unmount
  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Function to get current scroll position
  const getScrollPosition = () => scrollPositionRef.current;

  // Function to set update callback
  const setUpdateCallback = (callback) => {
    updateCallbackRef.current = callback;
  };

  return {
    getScrollPosition,
    setUpdateCallback,
    isDragging,
    dragDistance,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    cleanup
  };
}; 