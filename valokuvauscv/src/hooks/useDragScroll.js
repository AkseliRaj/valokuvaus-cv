import { useState, useRef, useCallback } from 'react';

export const useDragScroll = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const updateCallbackRef = useRef(null);

  // Direct scroll position update without excessive batching
  const setScrollPosition = useCallback((newPosition) => {
    scrollPositionRef.current = newPosition;
    if (updateCallbackRef.current) {
      updateCallbackRef.current(newPosition);
    }
  }, []);

  // Simple throttled update using requestAnimationFrame
  const throttledUpdate = useCallback((newPosition) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setScrollPosition(newPosition);
    });
  }, [setScrollPosition]);

  // Mouse event handlers for dragging
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({
      x: e.clientX - scrollPositionRef.current.x,
      y: e.clientY - scrollPositionRef.current.y
    });
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate drag distance
    const distance = Math.sqrt(
      Math.pow(e.clientX - (dragStart.x + scrollPositionRef.current.x), 2) +
      Math.pow(e.clientY - (dragStart.y + scrollPositionRef.current.y), 2)
    );
    setDragDistance(distance);
    
    // Direct update for smoother dragging
    setScrollPosition({ x: newX, y: newY });
  }, [isDragging, dragStart, setScrollPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Keep drag distance for a short time to prevent click events
    setTimeout(() => setDragDistance(0), 100);
  }, []);

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({
      x: touch.clientX - scrollPositionRef.current.x,
      y: touch.clientY - scrollPositionRef.current.y
    });
  }, []);

  const handleTouchMove = useCallback((e) => {
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
    
    // Direct update for smoother touch dragging
    setScrollPosition({ x: newX, y: newY });
  }, [isDragging, dragStart, setScrollPosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    // Keep drag distance for a short time to prevent click events
    setTimeout(() => setDragDistance(0), 100);
  }, []);

  // Wheel event for zoom-like scrolling
  const handleWheel = useCallback((e) => {
    const deltaX = e.deltaX || 0;
    const deltaY = e.deltaY || 0;
    
    // Apply wheel sensitivity for smoother scrolling
    const sensitivity = 1.2;
    const newPosition = {
      x: scrollPositionRef.current.x - (deltaX * sensitivity),
      y: scrollPositionRef.current.y - (deltaY * sensitivity)
    };
    
    // Use throttled update for wheel events to prevent excessive updates
    throttledUpdate(newPosition);
  }, [throttledUpdate]);

  // Cleanup animation frame on unmount
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Function to get current scroll position
  const getScrollPosition = useCallback(() => scrollPositionRef.current, []);

  // Function to set update callback
  const setUpdateCallback = useCallback((callback) => {
    updateCallbackRef.current = callback;
  }, []);

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