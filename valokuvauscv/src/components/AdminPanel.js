import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exifr from 'exifr';
import './AdminPanel.css';

const AdminPanel = ({ onLogout }) => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [error, setError] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    photoType: '',
    dateFrom: '',
    dateTo: '',
    camera: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const [uploadForm, setUploadForm] = useState({
    date: '',
    shutter_speed: '',
    iso: '',
    focal_length: '',
    aperture: '',
    camera_info: '',
    is_black_white: false,
    category_id: '',
    image: null
  });
  const [metadataExtracted, setMetadataExtracted] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPhotos();
    fetchCategories();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/photos');
      const data = await response.json();
      setPhotos(data);
      setFilteredPhotos(data);
    } catch (err) {
      setError('Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  // Filter photos based on current filters
  const filterPhotos = () => {
    let filtered = [...photos];

    // Search filter (searches in filename, camera info, and category)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(photo => 
        photo.filename.toLowerCase().includes(searchLower) ||
        (photo.camera_info && photo.camera_info.toLowerCase().includes(searchLower)) ||
        (photo.category_name && photo.category_name.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(photo => photo.category_id == filters.category);
    }

    // Photo type filter
    if (filters.photoType) {
      const isBlackWhite = filters.photoType === 'black_white';
      filtered = filtered.filter(photo => photo.is_black_white == isBlackWhite);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(photo => photo.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(photo => photo.date <= filters.dateTo);
    }

    // Camera filter
    if (filters.camera) {
      const cameraLower = filters.camera.toLowerCase();
      filtered = filtered.filter(photo => 
        photo.camera_info && photo.camera_info.toLowerCase().includes(cameraLower)
      );
    }

    setFilteredPhotos(filtered);
  };

  // Apply filters when filters change
  useEffect(() => {
    filterPhotos();
  }, [filters, photos]);

  const extractMetadata = async (file) => {
    try {
      const exifData = await exifr.parse(file);
      
      if (exifData) {
        const metadata = {
          date: '',
          shutter_speed: '',
          iso: '',
          focal_length: '',
          aperture: '',
          camera_info: ''
        };

        // Extract date
        if (exifData.DateTimeOriginal) {
          const date = new Date(exifData.DateTimeOriginal);
          metadata.date = date.toISOString().split('T')[0];
        } else if (exifData.DateTime) {
          const date = new Date(exifData.DateTime);
          metadata.date = date.toISOString().split('T')[0];
        }

        // Extract shutter speed
        if (exifData.ExposureTime) {
          metadata.shutter_speed = `1/${Math.round(1/exifData.ExposureTime)}`;
        }

        // Extract ISO
        if (exifData.ISO) {
          metadata.iso = exifData.ISO.toString();
        }

        // Extract focal length
        if (exifData.FocalLength) {
          metadata.focal_length = `${Math.round(exifData.FocalLength)}mm`;
        }

        // Extract aperture
        if (exifData.FNumber) {
          metadata.aperture = `f/${exifData.FNumber}`;
        }

        // Extract camera info
        const cameraParts = [];
        if (exifData.Make) cameraParts.push(exifData.Make);
        if (exifData.Model) cameraParts.push(exifData.Model);
        if (cameraParts.length > 0) {
          metadata.camera_info = cameraParts.join(' ');
        }

        return metadata;
      }
    } catch (error) {
      console.log('No EXIF data found or error reading metadata:', error);
    }
    
    return null;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Extract metadata from the image
      const metadata = await extractMetadata(file);
      
      // Update form with extracted metadata, preserving any existing user input
      setUploadForm(prevForm => ({
        ...prevForm,
        image: file,
        ...(metadata && {
          date: metadata.date || prevForm.date,
          shutter_speed: metadata.shutter_speed || prevForm.shutter_speed,
          iso: metadata.iso || prevForm.iso,
          focal_length: metadata.focal_length || prevForm.focal_length,
          aperture: metadata.aperture || prevForm.aperture,
          camera_info: metadata.camera_info || prevForm.camera_info
        })
      }));
      
      // Set flag to show metadata was extracted
      setMetadataExtracted(!!metadata);
    }
  };

  const handleInputChange = (e) => {
    setUploadForm({
      ...uploadForm,
      [e.target.name]: e.target.value
    });
  };

  const clearMetadata = () => {
    setUploadForm(prevForm => ({
      ...prevForm,
      date: '',
      shutter_speed: '',
      iso: '',
      focal_length: '',
      aperture: '',
      camera_info: ''
    }));
    setMetadataExtracted(false);
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
    formData.append('date', uploadForm.date);
    formData.append('shutter_speed', uploadForm.shutter_speed);
    formData.append('iso', uploadForm.iso);
    formData.append('focal_length', uploadForm.focal_length);
    formData.append('aperture', uploadForm.aperture);
    formData.append('camera_info', uploadForm.camera_info);
    formData.append('is_black_white', uploadForm.is_black_white);
    formData.append('category_id', uploadForm.category_id);

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
          date: '',
          shutter_speed: '',
          iso: '',
          focal_length: '',
          aperture: '',
          camera_info: '',
          is_black_white: false,
          category_id: '',
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });

      if (response.ok) {
        setNewCategoryName('');
        setShowCategoryForm(false);
        fetchCategories();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add category');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete category');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      photoType: '',
      dateFrom: '',
      dateTo: '',
      camera: ''
    });
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
        <button 
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          className="category-btn"
        >
          {showCategoryForm ? 'Cancel' : 'Manage Categories'}
        </button>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="filter-btn"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showUploadForm && (
        <div className="upload-form">
          <h3>Upload New Photo</h3>
          {metadataExtracted && (
            <div className="metadata-notification">
              <span>✅ Metadata automatically extracted from image</span>
              <button 
                type="button" 
                onClick={clearMetadata}
                className="clear-metadata-btn"
              >
                Clear Metadata
              </button>
            </div>
          )}
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
                <small>Select an image to automatically extract camera metadata (EXIF data)</small>
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

            <div className="form-row">
              <div className="form-group">
                <label>Photo Type</label>
                <select
                  name="is_black_white"
                  value={uploadForm.is_black_white}
                  onChange={(e) => setUploadForm({
                    ...uploadForm,
                    is_black_white: e.target.value === 'true'
                  })}
                >
                  <option value={false}>Color</option>
                  <option value={true}>Black & White</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category_id"
                  value={uploadForm.category_id}
                  onChange={handleInputChange}
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

            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </form>
        </div>
      )}

      {showCategoryForm && (
        <div className="category-form">
          <h3>Manage Categories</h3>
          <form onSubmit={handleAddCategory}>
            <div className="form-row">
              <div className="form-group">
                <label>New Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="add-category-btn">
                  Add Category
                </button>
              </div>
            </div>
          </form>
          
          <div className="categories-list">
            <h4>Existing Categories</h4>
            {categories.map(category => (
              <div key={category.id} className="category-item">
                <span>{category.name}</span>
                <button 
                  onClick={() => handleDeleteCategory(category.id)}
                  className="delete-category-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showFilters && (
        <div className="filter-form">
          <h3>Filter Photos</h3>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by filename, camera, or category..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Photo Type</label>
              <select
                value={filters.photoType}
                onChange={(e) => handleFilterChange('photoType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="color">Color</option>
                <option value="black_white">Black & White</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Camera</label>
              <input
                type="text"
                placeholder="Filter by camera model..."
                value={filters.camera}
                onChange={(e) => handleFilterChange('camera', e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label>Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label>Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
            <span className="filter-results">
              Showing {filteredPhotos.length} of {photos.length} photos
            </span>
          </div>
        </div>
      )}

      <div className="photos-grid">
        <h3>Manage Photos ({filteredPhotos.length} of {photos.length})</h3>
        {filteredPhotos.map(photo => (
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

              <div className="form-row">
                <div className="form-group">
                  <label>Photo Type</label>
                  <select
                    value={editingPhoto.is_black_white || false}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      is_black_white: e.target.value === 'true'
                    })}
                  >
                    <option value={false}>Color</option>
                    <option value={true}>Black & White</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editingPhoto.category_id || ''}
                    onChange={(e) => setEditingPhoto({
                      ...editingPhoto,
                      category_id: e.target.value || null
                    })}
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