import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PhotoCard from './PhotoCard';
import ImageModal from './ImageModal';
import { basePhotos } from '../data/photoData';
import './InfiniteGrid.css';

const InfiniteGrid = React.memo(({ gridConfig, getScrollPosition, setUpdateCallback, dragDistance, onModalStateChange }) => {
  const gridRef = useRef(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const lastScrollRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomSeed, setRandomSeed] = useState(Math.random());

  // Fetch photos from database
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/photos');
        if (response.ok) {
          const data = await response.json();
          // Transform database photos to match the expected format
          const transformedPhotos = data.map(photo => ({
            id: photo.id,
            src: `http://localhost:5000/uploads/${photo.filename}`,
            alt: `Photo ${photo.id}`,
            // Add metadata for display
            metadata: {
              date: photo.date,
              shutter_speed: photo.shutter_speed,
              iso: photo.iso,
              focal_length: photo.focal_length,
              aperture: photo.aperture,
              camera_info: photo.camera_info,
              is_black_white: photo.is_black_white,
              category_name: photo.category_name
            }
          }));
          setPhotos(transformedPhotos);
        } else {
          // Fallback to static photos if API fails
          setPhotos(basePhotos);
        }
      } catch (error) {
        console.error('Failed to fetch photos:', error);
        // Fallback to static photos
        setPhotos(basePhotos);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Simplified scroll position update
  const updateScrollPosition = useCallback((newPosition) => {
    // Only update if position changed significantly
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

  // Seeded random function for consistent randomization
  const seededRandom = useCallback((seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }, []);

  // Get random photo for a specific grid position
  const getRandomPhotoForPosition = useCallback((row, col) => {
    if (photos.length === 0) return null;
    
    // Create a unique seed for each position using row, col, and global random seed
    const positionSeed = (row * 73856093) ^ (col * 19349663) ^ (randomSeed * 83492791);
    const randomValue = seededRandom(positionSeed);
    
    // Use the random value to select a photo
    const photoIndex = Math.floor(randomValue * photos.length);
    return photos[photoIndex];
  }, [photos, randomSeed, seededRandom]);

  // Calculate which photos should be visible based on viewport
  const visiblePhotos = useMemo(() => {
    if (loading || photos.length === 0) {
      return [];
    }

    const { photoWidth, photoHeight, gap, columns } = gridConfig;
    const cellWidth = photoWidth + gap;
    const cellHeight = photoHeight + gap;
    
    // Use a reasonable buffer to ensure no cutoff
    const buffer = 6; // Reduced buffer for better performance
    
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
        // Get a random photo for this position
        const photo = getRandomPhotoForPosition(row, col);
        
        if (photo) {
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
    }
    
    // Limit the number of visible photos to prevent performance issues
    return visible.slice(0, 200); // Limit to 200 photos max
  }, [gridConfig, scrollPosition, viewport, photos, loading, getRandomPhotoForPosition]);

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

  // Optimized DOM manipulation for transform
  useEffect(() => {
    if (gridRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        if (gridRef.current) {
          gridRef.current.style.transform = `translate(${scrollPosition.x}px, ${scrollPosition.y}px)`;
        }
      });
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollPosition]);

  const handlePhotoClick = useCallback((photo) => {
    setModalPhoto(photo);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setModalPhoto(null);
  }, []);

  // Notify parent component when modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(isModalOpen);
    }
  }, [isModalOpen, onModalStateChange]);

  // Function to refresh randomization (can be called from parent if needed)
  const refreshRandomization = useCallback(() => {
    setRandomSeed(Math.random());
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading photos...</div>
      </div>
    );
  }

  return (
    <>
      <div className="infinite-grid" ref={gridRef}>
        {visiblePhotos.map((photo) => (
          <PhotoCard 
            key={photo.id} 
            photo={photo} 
            style={photo.style}
            onPhotoClick={handlePhotoClick}
            dragDistance={dragDistance}
          />
        ))}
      </div>
      <ImageModal 
        isOpen={isModalOpen}
        photo={modalPhoto}
        onClose={handleModalClose}
      />
    </>
  );
});

export default InfiniteGrid; 