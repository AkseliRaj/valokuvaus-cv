import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = ({ onLogout }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    date: '',
    shutter_speed: '',
    iso: '',
    focal_length: '',
    aperture: '',
    camera_info: '',
    image: null
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/photos');
      const data = await response.json();
      setPhotos(data);
    } catch (err) {
      setError('Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadForm({
      ...uploadForm,
      image: e.target.files[0]
    });
  };

  const handleInputChange = (e) => {
    setUploadForm({
      ...uploadForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.image) {
      setError('Please select an image');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', uploadForm.image);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('date', uploadForm.date);
    formData.append('shutter_speed', uploadForm.shutter_speed);
    formData.append('iso', uploadForm.iso);
    formData.append('focal_length', uploadForm.focal_length);
    formData.append('aperture', uploadForm.aperture);
    formData.append('camera_info', uploadForm.camera_info);

    try {
      const response = await fetch('http://localhost:5000/api/photos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setUploadForm({
          title: '',
          description: '',
          date: '',
          shutter_speed: '',
          iso: '',
          focal_length: '',
          aperture: '',
          camera_info: '',
          image: null
        });
        setShowUploadForm(false);
        fetchPhotos();
      } else {
        const data = await response.json();
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/photos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPhotos();
      } else {
        setError('Failed to delete photo');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5000/api/photos/${editingPhoto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingPhoto)
      });

      if (response.ok) {
        setEditingPhoto(null);
        fetchPhotos();
      } else {
        setError('Failed to update photo');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  const goToGallery = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-header-buttons">
          <button onClick={goToGallery} className="gallery-btn">
            Back to Gallery
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-actions">
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="upload-btn"
        >
          {showUploadForm ? 'Cancel Upload' : 'Upload New Photo'}
        </button>
      </div>

      {showUploadForm && (
        <div className="upload-form">
          <h3>Upload New Photo</h3>
          <form onSubmit={handleUpload}>
            <div className="form-row">
              <div className="form-group">
                <label>Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={uploadForm.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={uploadForm.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={uploadForm.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Shutter Speed</label>
                <input
                  type="text"
                  name="shutter_speed"
                  value={uploadForm.shutter_speed}
                  onChange={handleInputChange}
                  placeholder="e.g., 1/1000"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ISO</label>
                <input
                  type="text"
                  name="iso"
                  value={uploadForm.iso}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                />
              </div>
              <div className="form-group">
                <label>Focal Length</label>
                <input
                  type="text"
                  name="focal_length"
                  value={uploadForm.focal_length}
                  onChange={handleInputChange}
                  placeholder="e.g., 50mm"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Aperture</label>
                <input
                  type="text"
                  name="aperture"
                  value={uploadForm.aperture}
                  onChange={handleInputChange}
                  placeholder="e.g., f/2.8"
                />
              </div>
              <div className="form-group">
                <label>Camera Info</label>
                <input
                  type="text"
                  name="camera_info"
                  value={uploadForm.camera_info}
                  onChange={handleInputChange}
                  placeholder="e.g., Canon EOS R5"
                />
              </div>
            </div>

            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </form>
        </div>
      )}

      <div className="photos-grid">
        <h3>Manage Photos ({photos.length})</h3>
        {photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <img 
              src={`http://localhost:5000/uploads/${photo.filename}`} 
              alt={photo.title || 'Photo'}
            />
            <div className="photo-info">
              <h4>{photo.title || 'Untitled'}</h4>
              <p>{photo.description}</p>
              <div className="photo-metadata">
                {photo.date && <span>Date: {photo.date}</span>}
                {photo.shutter_speed && <span>Shutter: {photo.shutter_speed}</span>}
                {photo.iso && <span>ISO: {photo.iso}</span>}
                {photo.focal_length && <span>Focal: {photo.focal_length}</span>}
                {photo.aperture && <span>Aperture: {photo.aperture}</span>}
                {photo.camera_info && <span>Camera: {photo.camera_info}</span>}
              </div>
              <div className="photo-actions">
                <button 
                  onClick={() => setEditingPhoto(photo)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(photo.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPhoto && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Photo</h3>
            <form onSubmit={handleEdit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editingPhoto.title || ''}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      title: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editingPhoto.description || ''}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      description: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={editingPhoto.date || ''}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      date: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Shutter Speed</label>
                  <input
                    type="text"
                    value={editingPhoto.shutter_speed || ''}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      shutter_speed: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ISO</label>
                  <input
                    type="text"
                    value={editingPhoto.iso || ''}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      iso: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Focal Length</label>
                  <input
                    type="text"
                    value={editingPhoto.focal_length || ''}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      focal_length: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Aperture</label>
                  <input
                    type="text"
                    value={editingPhoto.aperture || ''}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      aperture: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Camera Info</label>
                  <input
                    type="text"
                    value={editingPhoto.camera_info || ''}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      camera_info: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="edit-actions">
                <button type="submit">Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => setEditingPhoto(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 