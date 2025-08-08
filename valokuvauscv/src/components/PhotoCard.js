import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './PhotoCard.css';

const PhotoCard = React.memo(({ photo, style, onPhotoClick, dragDistance, isDragging, isFilterChanging }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const imgRef = useRef(null);
  const cardRef = useRef(null);

  // Memoized style to prevent unnecessary re-renders
  const memoizedStyle = useMemo(() => style, [style]);

  // Track if user has dragged recently
  useEffect(() => {
    if (dragDistance > 5) {
      setHasDragged(true);
      // Reset the flag after a delay to allow clicking again
      const timer = setTimeout(() => {
        setHasDragged(false);
      }, 300); // 300ms delay before allowing clicks again
      return () => clearTimeout(timer);
    }
  }, [dragDistance]);

  // Reset drag flag when dragging stops
  useEffect(() => {
    if (!isDragging && hasDragged) {
      const timer = setTimeout(() => {
        setHasDragged(false);
      }, 200); // 200ms delay after dragging stops
      return () => clearTimeout(timer);
    }
  }, [isDragging, hasDragged]);

  // Optimized Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading slightly before the image comes into view
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleClick = useCallback(() => {
    // Prevent click if user has dragged or is currently dragging
    if (dragDistance > 5 || hasDragged || isDragging) {
      return;
    }
    
    if (onPhotoClick) {
      onPhotoClick(photo);
    }
  }, [dragDistance, hasDragged, isDragging, onPhotoClick, photo]);

  return (
    <div className={`photo-card ${isFilterChanging ? 'filter-transition' : ''}`} ref={cardRef} style={memoizedStyle}>
      <div className="photo-wrapper" onClick={handleClick}>
        {isVisible && (
          <img 
            ref={imgRef}
            src={photo.src} 
            alt={photo.alt}
            loading="lazy"
            className={`photo-image ${isLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            // Add decoding attribute for better performance
            decoding="async"
          />
        )}
      </div>
    </div>
  );
});

export default PhotoCard; 