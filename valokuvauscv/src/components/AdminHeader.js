import React from 'react';
import './AdminHeader.css';

const AdminHeader = ({ onGoToGallery, onLogout }) => {
  return (
    <div className="admin-header">
      <h1>Admin Panel</h1>
      <div className="admin-header-buttons">
        <button onClick={onGoToGallery} className="gallery-btn">
          Back to Gallery
        </button>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHeader; 