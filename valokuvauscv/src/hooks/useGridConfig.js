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
      let newConfig;
      
      if (width <= 480) {
        newConfig = { columns: 3, photoWidth: 250, photoHeight: 375, gap: 10 };
      } else if (width <= 768) {
        newConfig = { columns: 5, photoWidth: 300, photoHeight: 450, gap: 15 };
      } else {
        newConfig = { columns: 7, photoWidth: 400, photoHeight: 600, gap: 20 };
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