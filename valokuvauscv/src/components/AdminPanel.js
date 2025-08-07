import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

// Import the new smaller components
import AdminHeader from './AdminHeader';
import AdminActions from './AdminActions';
import UploadModal from './UploadModal';
import CategoryManager from './CategoryManager';
import PhotoGrid from './PhotoGrid';
import EditPhotoModal from './EditPhotoModal';

const AdminPanel = ({ onLogout }) => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    photoType: '',
    dateFrom: '',
    dateTo: '',
    camera: ''
  });

  const navigate = useNavigate();
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

  // Upload handlers
  const handleUpload = async (uploadForm) => {
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

    const response = await fetch('http://localhost:5000/api/photos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Upload failed');
    }

    fetchPhotos();
    setShowUploadModal(false); // Close modal after successful upload
  };

  // Delete handlers
  const handleDelete = async (id) => {
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

  // Edit handlers
  const handleEdit = async (updatedPhoto) => {
    try {
      const response = await fetch(`http://localhost:5000/api/photos/${updatedPhoto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedPhoto)
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

  // Category handlers
  const handleAddCategory = async (categoryName) => {
    const response = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: categoryName })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to add category');
    }

    fetchCategories();
  };

  const handleDeleteCategory = async (categoryId) => {
    const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete category');
    }

    fetchCategories();
  };

  // Filter handlers
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

  // Navigation handlers
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutConfirmation(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const goToGallery = () => {
    navigate('/');
  };

  // UI toggle handlers
  const openUploadModal = () => setShowUploadModal(true);
  const closeUploadModal = () => setShowUploadModal(false);
  const toggleCategoryForm = () => setShowCategoryForm(!showCategoryForm);
  const toggleFilters = () => setShowFilters(!showFilters);

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <AdminHeader 
        onGoToGallery={goToGallery}
        onLogout={handleLogout}
      />

      {error && <div className="error-message">{error}</div>}

      <AdminActions 
        showUploadForm={showUploadModal}
        showCategoryForm={showCategoryForm}
        onToggleUpload={openUploadModal}
        onToggleCategories={toggleCategoryForm}
      />

      <UploadModal 
        isOpen={showUploadModal}
        onClose={closeUploadModal}
        categories={categories}
        onUpload={handleUpload}
      />

      <CategoryManager 
        isOpen={showCategoryForm}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onClose={toggleCategoryForm}
      />

      <PhotoGrid 
        photos={filteredPhotos}
        onEdit={setEditingPhoto}
        onDelete={handleDelete}
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        totalCount={photos.length}
      />

      {editingPhoto && (
        <EditPhotoModal 
          photo={editingPhoto}
          categories={categories}
          onSave={handleEdit}
          onCancel={() => setEditingPhoto(null)}
        />
      )}

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

export default AdminPanel; 