import { useState, useEffect, useRef } from 'react';

export const useGridConfig = () => {
  const [gridConfig, setGridConfig] = useState({ 
    columns: 7, 
    photoWidth: 400, 
    photoHeight: 600, 
    gap: 20 
  });
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    const updateGridConfig = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let newConfig;
      
      if (width <= 480) {
        newConfig = { columns: 3, photoWidth: 180, photoHeight: 270, gap: 15 };
      } else if (width <= 768) {
        newConfig = { columns: 5, photoWidth: 220, photoHeight: 330, gap: 20 };
      } else if (width >= 2560) {
        // Ultra-high resolution displays (2560p and above) - largest photos
        newConfig = { columns: 8, photoWidth: 400, photoHeight: 600, gap: 40 };
      } else if (width >= 1920) {
        // High-resolution displays (1920p) - medium-large photos
        newConfig = { columns: 7, photoWidth: 300, photoHeight: 450, gap: 30 };
      } else if (width >= 1440) {
        // Medium-high resolution displays
        newConfig = { columns: 7, photoWidth: 280, photoHeight: 420, gap: 25 };
      } else {
        newConfig = { columns: 7, photoWidth: 280, photoHeight: 420, gap: 25 };
      }
      
      setGridConfig(newConfig);
    };

    const throttledUpdate = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(updateGridConfig, 100);
    };

    updateGridConfig();
    window.addEventListener('resize', throttledUpdate);
    return () => {
      window.removeEventListener('resize', throttledUpdate);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return gridConfig;
};