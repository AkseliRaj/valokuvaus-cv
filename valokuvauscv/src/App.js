import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import InfiniteGrid from './components/InfiniteGrid';
import InstructionsOverlay from './components/InstructionsOverlay';
import AdminPage from './components/AdminPage';
import { useGridConfig } from './hooks/useGridConfig';
import { useDragScroll } from './hooks/useDragScroll';
import './App.css';

// Gallery component (main page)
const Gallery = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const gridConfig = useGridConfig();
  const {
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
  } = useDragScroll();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  const goToGallery = () => {
    navigate('/');
  };

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
      {/* Admin button for authenticated users */}
      {isAuthenticated && (
        <div className="admin-controls">
          <button onClick={goToAdmin} className="admin-btn">
            Admin Panel
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}

      {/* Login button for non-authenticated users */}
      {!isAuthenticated && (
        <div className="login-button-container">
          <button onClick={goToAdmin} className="login-btn">
            Admin Login
          </button>
        </div>
      )}

      <InfiniteGrid 
        gridConfig={gridConfig} 
        getScrollPosition={getScrollPosition}
        setUpdateCallback={setUpdateCallback}
        dragDistance={dragDistance}
      />
      <InstructionsOverlay />
    </div>
  );
};

// Main App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
