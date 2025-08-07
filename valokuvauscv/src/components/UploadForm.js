import React, { useState, useEffect } from 'react';
import exifr from 'exifr';
import './UploadForm.css';

const UploadForm = ({ categories, onUpload, onCancel, onUnsavedChanges }) => {
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Notify parent about unsaved changes
  useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onUnsavedChanges]);

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
      // Create preview URL for thumbnail
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
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
      setHasUnsavedChanges(true);
    }
  };

  const handleInputChange = (e) => {
    setUploadForm({
      ...uploadForm,
      [e.target.name]: e.target.value
    });
    setHasUnsavedChanges(true);
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
    // Don't reset metadataExtracted flag so buttons remain visible
    setHasUnsavedChanges(true);
  };

  const clearImageAndForm = () => {
    // Clear the image and preview
    setUploadForm(prevForm => ({
      ...prevForm,
      image: null,
      date: '',
      shutter_speed: '',
      iso: '',
      focal_length: '',
      aperture: '',
      camera_info: '',
      is_black_white: false,
      category_id: ''
    }));
    setMetadataExtracted(false);
    setPreviewUrl(null);
    setError('');
    setHasUnsavedChanges(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.image) {
      setError('Please select an image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await onUpload(uploadForm);
      
      // Reset form on successful upload
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
      setMetadataExtracted(false);
      setPreviewUrl(null);
      setHasUnsavedChanges(false);
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="upload-form">
      <h3>Upload New Photo</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Image File *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {uploadForm.image && (
              <small>Selected: {uploadForm.image.name}</small>
            )}
            <small>Select an image to automatically extract camera metadata (EXIF data)</small>
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
            {metadataExtracted && (
              <div className="action-buttons">
                <button 
                  type="button" 
                  onClick={clearMetadata}
                  className="clear-metadata-btn"
                >
                  Clear Metadata
                </button>
                <button
                  type="button"
                  onClick={clearImageAndForm}
                  className="remove-image-btn"
                >
                  Remove Image
                </button>
              </div>
            )}
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

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm; 