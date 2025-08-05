import React, { useRef, useEffect, useState } from 'react';
import InfiniteGrid from './components/InfiniteGrid';
import InstructionsOverlay from './components/InstructionsOverlay';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { useGridConfig } from './hooks/useGridConfig';
import { useDragScroll } from './hooks/useDragScroll';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    
    console.log('Checking authentication:', { token: !!token, userData: !!userData });
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setIsAdmin(true); // Set as admin if authenticated
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

  const handleLogin = (data) => {
    setIsAuthenticated(true);
    setUser(data.user);
    setIsAdmin(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    setShowAdmin(false);
  };

  const toggleAdmin = () => {
    console.log('Toggle admin called. Current showAdmin:', showAdmin);
    setShowAdmin(!showAdmin);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Debug logging
  console.log('App state:', { isAuthenticated, isAdmin, showAdmin, user });

  // Show admin panel if admin and showAdmin is true
  if (isAuthenticated && showAdmin) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  // Show main gallery with login button or admin controls
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
      {/* Login button for non-authenticated users */}
      {!isAuthenticated && (
        <div className="login-button-container">
          <button onClick={openLoginModal} className="login-btn">
            Admin Login
          </button>
        </div>
      )}

      {/* Admin controls for authenticated users */}
      {isAuthenticated && (
        <div className="admin-controls">
          <button onClick={toggleAdmin} className="admin-btn">
            {showAdmin ? 'Back to Gallery' : 'Admin Panel'}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
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

      {/* Login modal */}
      {showLoginModal && (
        <div className="login-modal-overlay" onClick={closeLoginModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <Login onLogin={handleLogin} />
            <button className="close-modal-btn" onClick={closeLoginModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
