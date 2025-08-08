import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './PhotoCard.css';

const PhotoCard = React.memo(({ photo, style, onPhotoClick, dragDistance }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);
  const cardRef = useRef(null);

  // Memoized style to prevent unnecessary re-renders
  const memoizedStyle = useMemo(() => style, [style]);

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
    // Prevent click if user has dragged (moved more than 5 pixels)
    if (dragDistance > 5) {
      return;
    }
    
    if (onPhotoClick) {
      onPhotoClick(photo);
    }
  }, [dragDistance, onPhotoClick, photo]);

  return (
    <div className="photo-card" ref={cardRef} style={memoizedStyle}>
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