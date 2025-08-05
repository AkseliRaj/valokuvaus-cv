# Photography Portfolio with Admin Panel

A modern photography portfolio website with an admin panel for managing photos and metadata. Built with React frontend and Express.js backend with SQLite database.

## Project Structure

```
valokuvaus-cv/
├── backend/           # Express.js backend server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── README.md     # Backend documentation
├── frontend/         # React frontend application
│   ├── valokuvauscv/ # React app (existing)
│   └── README.md     # Frontend documentation
└── README.md         # This file
```

## Features

### Public Gallery
- Infinite scroll photography gallery
- Responsive design with drag-to-scroll functionality
- Photo modal with detailed view and metadata display
- Photography metadata support (shutter speed, ISO, focal length, aperture, camera info)

### Admin Panel
- Secure login system
- Upload new photos with optional metadata
- Edit existing photos and metadata
- Delete photos
- View all uploaded photos in a management interface

### Photography Metadata
- Date
- Shutter Speed
- ISO
- Focal Length
- Aperture
- Camera Information

All metadata fields are optional - photos can be uploaded with just the image file.

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
   cd frontend/valokuvauscv
   npm install
   npm start
   ```
   Frontend will run on `http://localhost:3000`

### Production Setup

1. **Build the frontend**
   ```bash
   cd frontend/valokuvauscv
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
3. Fill in the optional metadata fields
4. Click "Upload Photo"

## API Endpoints

### Authentication
- `POST /api/login` - Admin login

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload new photo (admin only)
- `PUT /api/photos/:id` - Update photo metadata (admin only)
- `DELETE /api/photos/:id` - Delete photo (admin only)

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

- **Frontend:** React, CSS3
- **Backend:** Express.js, SQLite3
- **Authentication:** JWT, bcryptjs
- **File Upload:** Multer
- **Database:** SQLite

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

4. **Login issues:**
   - Default credentials: admin/admin123
   - Check browser console for network errors

### Database Reset

To reset the database and start fresh:
1. Stop the backend server
2. Delete `backend/photography.db`
3. Restart the backend server - it will create a new database with default admin user

## License

This project is open source and available under the MIT License. 