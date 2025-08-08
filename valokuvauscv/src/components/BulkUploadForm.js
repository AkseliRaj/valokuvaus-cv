import React, { useState, useEffect } from 'react';
import exifr from 'exifr';
import './BulkUploadForm.css';

const BulkUploadForm = ({ categories, onUpload, onCancel, onUnsavedChanges, onComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Mass selection settings
  const [massSettings, setMassSettings] = useState({
    category_id: '',
    is_black_white: false,
    applyToAll: false
  });

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
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const fileData = [];
      
      for (const file of files) {
        // Create preview URL for thumbnail
        const url = URL.createObjectURL(file);
        
        // Extract metadata from the image
        const metadata = await extractMetadata(file);
        
        fileData.push({
          file,
          previewUrl: url,
          metadata: metadata || {},
          hasMetadata: !!metadata,
          // Individual settings for each file
          category_id: '',
          is_black_white: false
        });
      }
      
      setSelectedFiles(fileData);
      setHasUnsavedChanges(true);
    }
  };

  const handleMassSettingChange = (field, value) => {
    setMassSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleIndividualFileSetting = (index, field, value) => {
    setSelectedFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, [field]: value } : file
    ));
    setHasUnsavedChanges(true);
  };

  const applyMassSettingsToAll = () => {
    setSelectedFiles(prev => prev.map(file => ({
      ...file,
      category_id: massSettings.category_id,
      is_black_white: massSettings.is_black_white
    })));
    setHasUnsavedChanges(true);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setHasUnsavedChanges(newFiles.length > 0);
  };

  const clearAllFiles = () => {
    // Cleanup preview URLs
    selectedFiles.forEach(fileData => {
      if (fileData.previewUrl) {
        URL.revokeObjectURL(fileData.previewUrl);
      }
    });
    
    setSelectedFiles([]);
    setError('');
    setHasUnsavedChanges(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload each file
      for (const fileData of selectedFiles) {
        const formData = new FormData();
        formData.append('image', fileData.file);
        
        // Use individual file settings
        formData.append('date', fileData.metadata.date || '');
        formData.append('shutter_speed', fileData.metadata.shutter_speed || '');
        formData.append('iso', fileData.metadata.iso || '');
        formData.append('focal_length', fileData.metadata.focal_length || '');
        formData.append('aperture', fileData.metadata.aperture || '');
        formData.append('camera_info', fileData.metadata.camera_info || '');
        formData.append('is_black_white', fileData.is_black_white);
        formData.append('category_id', fileData.category_id);
        
        await onUpload(formData);
      }
      
      // Reset form on successful upload
      clearAllFiles();
      setMassSettings({
        category_id: '',
        is_black_white: false,
        applyToAll: false
      });
      if (onCancel) {
        onCancel();
      }
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedFiles.forEach(fileData => {
        if (fileData.previewUrl) {
          URL.revokeObjectURL(fileData.previewUrl);
        }
      });
    };
  }, [selectedFiles]);

  return (
    <div className="bulk-upload-form">
      <h3>Bulk Upload Photos</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Select Images *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              required
            />
            <small>Select multiple images to upload at once. EXIF data will be automatically extracted.</small>
            {selectedFiles.length > 0 && (
              <div className="selected-files-info">
                <small>{selectedFiles.length} file(s) selected</small>
                <button 
                  type="button" 
                  onClick={clearAllFiles}
                  className="clear-files-btn"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Mass Settings (Optional)</label>
                <div className="mass-settings">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={massSettings.applyToAll}
                      onChange={(e) => handleMassSettingChange('applyToAll', e.target.checked)}
                    />
                    Apply settings to all photos
                  </label>
                  
                  {massSettings.applyToAll && (
                    <div className="mass-settings-fields">
                      <div className="mass-settings-row">
                        <div className="mass-settings-field">
                          <label>Photo Type (All Photos)</label>
                          <select
                            value={massSettings.is_black_white}
                            onChange={(e) => handleMassSettingChange('is_black_white', e.target.value === 'true')}
                          >
                            <option value={false}>Color</option>
                            <option value={true}>Black & White</option>
                          </select>
                        </div>
                        <div className="mass-settings-field">
                          <label>Category (All Photos)</label>
                          <select
                            value={massSettings.category_id}
                            onChange={(e) => handleMassSettingChange('category_id', e.target.value)}
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
                      <button 
                        type="button" 
                        onClick={applyMassSettingsToAll}
                        className="apply-mass-settings-btn"
                      >
                        Apply to All Photos
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="selected-files-grid">
              <h4>Selected Files ({selectedFiles.length})</h4>
              <div className="files-grid">
                {selectedFiles.map((fileData, index) => (
                  <div key={index} className="file-item">
                    <div className="file-preview">
                      <img src={fileData.previewUrl} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => removeFile(index)}
                        aria-label="Remove file"
                      >
                        ×
                      </button>
                    </div>
                    <div className="file-info">
                      <small className="file-name">{fileData.file.name}</small>
                      {fileData.hasMetadata && (
                        <small className="metadata-indicator">✓ EXIF Data</small>
                      )}
                    </div>
                    <div className="file-settings">
                      <div className="file-setting">
                        <label>Type:</label>
                        <select
                          value={fileData.is_black_white}
                          onChange={(e) => handleIndividualFileSetting(index, 'is_black_white', e.target.value === 'true')}
                        >
                          <option value={false}>Color</option>
                          <option value={true}>B&W</option>
                        </select>
                      </div>
                      <div className="file-setting">
                        <label>Category:</label>
                        <select
                          value={fileData.category_id}
                          onChange={(e) => handleIndividualFileSetting(index, 'category_id', e.target.value)}
                        >
                          <option value="">None</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" disabled={uploading || selectedFiles.length === 0}>
            {uploading ? `Uploading ${selectedFiles.length} photos...` : `Upload ${selectedFiles.length} Photos`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkUploadForm;
