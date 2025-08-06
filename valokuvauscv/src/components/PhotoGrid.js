import React from 'react';
import './PhotoGrid.css';

const PhotoGrid = ({ photos, onEdit, onDelete }) => {
  return (
    <div className="photos-grid">
      <h3>Manage Photos ({photos.length} photos)</h3>
      {photos.map(photo => (
        <div key={photo.id} className="photo-item">
          <img 
            src={`http://localhost:5000/uploads/${photo.filename}`} 
            alt={photo.title || 'Photo'}
          />
          <div className="photo-info">
            <h4>Photo #{photo.id}</h4>
            <div className="photo-metadata">
              {photo.date && <span>Date: {photo.date}</span>}
              {photo.shutter_speed && <span>Shutter: {photo.shutter_speed}</span>}
              {photo.iso && <span>ISO: {photo.iso}</span>}
              {photo.focal_length && <span>Focal: {photo.focal_length}</span>}
              {photo.aperture && <span>Aperture: {photo.aperture}</span>}
              {photo.camera_info && <span>Camera: {photo.camera_info}</span>}
              <span>Type: {photo.is_black_white ? 'Black & White' : 'Color'}</span>
              {photo.category_name && <span>Category: {photo.category_name}</span>}
            </div>
            <div className="photo-actions">
              <button 
                onClick={() => onEdit(photo)}
                className="edit-btn"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(photo.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid; 