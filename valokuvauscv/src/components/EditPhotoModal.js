import React, { useState, useEffect } from 'react';
import './EditPhotoModal.css';

const EditPhotoModal = ({ photo, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState(photo);

  // Update form data when photo prop changes
  useEffect(() => {
    setFormData(photo);
  }, [photo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!photo) return null;

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h3>Edit Photo</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Shutter Speed</label>
              <input
                type="text"
                value={formData.shutter_speed || ''}
                onChange={(e) => handleInputChange('shutter_speed', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ISO</label>
              <input
                type="text"
                value={formData.iso || ''}
                onChange={(e) => handleInputChange('iso', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Focal Length</label>
              <input
                type="text"
                value={formData.focal_length || ''}
                onChange={(e) => handleInputChange('focal_length', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Aperture</label>
              <input
                type="text"
                value={formData.aperture || ''}
                onChange={(e) => handleInputChange('aperture', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Camera Info</label>
              <input
                type="text"
                value={formData.camera_info || ''}
                onChange={(e) => handleInputChange('camera_info', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Photo Type</label>
              <select
                value={formData.is_black_white || false}
                onChange={(e) => handleInputChange('is_black_white', e.target.value === 'true')}
              >
                <option value={false}>Color</option>
                <option value={true}>Black & White</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => handleInputChange('category_id', e.target.value || null)}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="edit-actions">
            <button type="submit">Save Changes</button>
            <button 
              type="button" 
              onClick={onCancel}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPhotoModal; 