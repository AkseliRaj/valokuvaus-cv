# Photography Portfolio with Admin Panel

A modern photography portfolio website with an admin panel for managing photos and metadata. Built with React frontend and Express.js backend with SQLite database.

## Project Structure

```
valokuvaus-cv/
├── backend/           # Express.js backend server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   ├── photography.db # SQLite database
│   ├── uploads/      # Photo uploads directory
│   └── README.md     # Backend documentation
├── valokuvauscv/     # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel.js      # Main admin interface
│   │   │   ├── AdminHeader.js     # Admin panel header
│   │   │   ├── AdminActions.js    # Action buttons (upload, categories)
│   │   │   ├── UploadForm.js      # Photo upload form with EXIF extraction
│   │   │   ├── CategoryManager.js # Category management
│   │   │   ├── PhotoGrid.js       # Photo display with integrated filters
│   │   │   ├── EditPhotoModal.js  # Photo editing modal
│   │   │   ├── InfiniteGrid.js    # Public gallery with infinite scroll
│   │   │   ├── PhotoCard.js       # Individual photo card component
│   │   │   ├── ImageModal.js      # Photo modal for detailed view
│   │   │   ├── Login.js           # Authentication component
│   │   │   └── InstructionsOverlay.js # User instructions overlay
│   │   ├── hooks/
│   │   │   ├── useDragScroll.js   # Drag scroll functionality
│   │   │   └── useGridConfig.js   # Grid configuration hook
│   │   └── data/
│   │       └── photoData.js       # Sample photo data
│   ├── package.json  # Frontend dependencies
│   └── README.md     # Frontend documentation
└── README.md         # This file
```

## Features

### Public Gallery
- **Infinite Scroll**: Smooth infinite scroll photography gallery
- **Drag to Scroll**: Intuitive drag-to-scroll functionality for desktop users
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Photo Modal**: Detailed view with full metadata display
- **Metadata Display**: Shows photography metadata (shutter speed, ISO, focal length, aperture, camera info)
- **Category Filtering**: Filter photos by category
- **Photo Type Filtering**: Filter by color or black & white photos

### Admin Panel
- **Secure Authentication**: JWT-based login system
- **Modular Components**: Refactored into smaller, maintainable components
- **Photo Upload**: Upload new photos with automatic EXIF metadata extraction
- **Photo Management**: Edit, delete, and organize photos
- **Category Management**: Add and delete photo categories
- **Advanced Filtering**: Integrated filtering system with search, category, photo type, camera, and date range filters
- **Responsive Interface**: Optimized admin interface for all devices

### Photography Metadata Support
- **Automatic EXIF Extraction**: Automatically extracts metadata from uploaded photos
- **Manual Entry**: Option to manually enter or edit metadata
- **Comprehensive Data**: Date, shutter speed, ISO, focal length, aperture, camera information
- **Optional Fields**: All metadata fields are optional - photos can be uploaded with just the image file

## Quick Start

### Development Setup

1. **Start the backend server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd valokuvauscv
   npm install
   npm start
   ```
   Frontend will run on `http://localhost:3000`

### Production Setup

1. **Build the frontend**
   ```bash
   cd valokuvauscv
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```
   The backend will serve both the API and the React app.

## Default Admin Credentials
- **Username:** admin
- **Password:** admin123

**Important:** Change these credentials in production!

## Usage

### Accessing the Admin Panel

1. Open your browser and go to `http://localhost:3000`
2. You'll see the login screen
3. Enter the default credentials (admin/admin123)
4. After login, you'll see the main gallery with admin controls
5. Click "Admin Panel" to access the photo management interface

### Uploading Photos

1. In the admin panel, click "Upload New Photo"
2. Select an image file (supports: jpg, jpeg, png, gif, webp)
3. **EXIF metadata will be automatically extracted** from the image
4. Review and edit the metadata if needed
5. Select a category (optional)
6. Choose photo type (color or black & white)
7. Click "Upload Photo"

### Managing Photos

1. **View Photos**: All uploaded photos are displayed in the admin panel
2. **Edit Photos**: Click "Edit" on any photo to modify metadata
3. **Delete Photos**: Click "Delete" to remove photos (with confirmation)
4. **Filter Photos**: Use the integrated filtering system to find specific photos
   - Search by filename, camera, or category
   - Filter by category
   - Filter by photo type (color/black & white)
   - Filter by camera model
   - Filter by date range

### Managing Categories

1. Click "Manage Categories" in the admin panel
2. **Add Category**: Enter a new category name and click "Add Category"
3. **Delete Category**: Click "Delete" next to any category (with confirmation)

## API Endpoints

### Authentication
- `POST /api/login` - Admin login

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload new photo (admin only)
- `PUT /api/photos/:id` - Update photo metadata (admin only)
- `DELETE /api/photos/:id` - Delete photo (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add new category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Recent Improvements

### Component Refactoring
- **Modular Architecture**: Broke down the large AdminPanel component into smaller, focused components
- **Improved Maintainability**: Each component has a single responsibility
- **Better Code Organization**: Separated concerns for upload, categories, filtering, and photo management

### Enhanced User Experience
- **Integrated Filtering**: Moved filter options directly under the "Manage Photos" header
- **Consistent Styling**: Unified button colors and form field styling
- **Improved Responsiveness**: Better mobile experience across all components
- **Automatic Metadata Extraction**: EXIF data is automatically extracted from uploaded photos

### Technical Improvements
- **EXIF Integration**: Added `exifr` library for automatic metadata extraction
- **Better Error Handling**: Improved error states and user feedback
- **Optimized Performance**: Reduced component complexity and improved rendering efficiency

## Development vs Production

### Development
- Backend runs on port 5000
- Frontend runs on port 3000
- Frontend proxies API calls to backend
- Hot reloading for both frontend and backend

### Production
- Single server on port 5000
- Backend serves React build files
- All routes handled by Express server
- Optimized for deployment

## Security Notes

- Change the default admin password in production
- Update the JWT_SECRET in the backend configuration
- Consider implementing rate limiting for production use
- Ensure proper file upload validation and sanitization

## Technologies Used

### Frontend
- **React**: Modern UI framework
- **CSS3**: Custom styling with responsive design
- **React Hooks**: Custom hooks for drag scroll and grid configuration
- **EXIFR**: Automatic metadata extraction from photos

### Backend
- **Express.js**: Node.js web framework
- **SQLite3**: Lightweight database
- **JWT**: Authentication tokens
- **Multer**: File upload handling
- **bcryptjs**: Password hashing

## Troubleshooting

### Common Issues

1. **Server won't start:**
   - Check if port 5000 is available
   - Ensure all dependencies are installed

2. **Photos not loading:**
   - Verify the backend server is running on port 5000
   - Check browser console for CORS errors

3. **Upload fails:**
   - Ensure the `uploads` directory exists and is writable
   - Check file size (10MB limit)
   - Verify file type is supported
   - Check if EXIF extraction is working properly

4. **Login issues:**
   - Default credentials: admin/admin123
   - Check browser console for network errors

5. **EXIF extraction not working:**
   - Ensure the `exifr` package is installed
   - Check if the image contains EXIF data
   - Verify the image format supports EXIF (JPEG typically works best)

### Database Reset

To reset the database and start fresh:
1. Stop the backend server
2. Delete `backend/photography.db`
3. Restart the backend server - it will create a new database with default admin user

## License

This project is open source and available under the MIT License. 