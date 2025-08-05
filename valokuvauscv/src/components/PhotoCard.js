import React, { useState, useRef, useEffect } from 'react';
import './PhotoCard.css';

const PhotoCard = React.memo(({ photo, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);
  const cardRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="photo-card" ref={cardRef} style={style}>
      <div className="photo-wrapper">
        {isVisible && (
          <img 
            ref={imgRef}
            src={photo.src} 
            alt={photo.alt}
            loading="lazy"
            className={`photo-image ${isLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
          />
        )}
        <div className="photo-overlay">
          <h3>{photo.title}</h3>
          <p>{photo.description}</p>
        </div>
      </div>
    </div>
  );
});

export default PhotoCard; 