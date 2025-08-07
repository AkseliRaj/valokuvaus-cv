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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        if (isModalOpen) return; // Disable wheel when modal is open
        e.preventDefault();
        handleWheel(e);
      };
      
      const touchStartHandler = (e) => {
        if (isModalOpen) return; // Disable touch when modal is open
        handleTouchStart(e);
      };
      
      const touchMoveHandler = (e) => {
        if (isModalOpen) return; // Disable touch when modal is open
        e.preventDefault();
        handleTouchMove(e);
      };
      
      const touchEndHandler = (e) => {
        if (isModalOpen) return; // Disable touch when modal is open
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

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutConfirmation(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
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
      onMouseDown={isModalOpen ? undefined : handleMouseDown}
      onMouseMove={isModalOpen ? undefined : handleMouseMove}
      onMouseUp={isModalOpen ? undefined : handleMouseUp}
      onMouseLeave={isModalOpen ? undefined : handleMouseUp}
      style={{ cursor: isModalOpen ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
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
        onModalStateChange={setIsModalOpen}
      />
      <InstructionsOverlay />

      {/* Logout confirmation */}
      {showLogoutConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout? You will need to log in again to access the admin panel.</p>
            <div className="confirmation-actions">
              <button onClick={cancelLogout} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmLogout} className="confirm-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
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
