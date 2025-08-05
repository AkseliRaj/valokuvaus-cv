# Photography Portfolio with Admin Panel

A modern photography portfolio website with an admin panel for managing photos and metadata. Built with React frontend and Express.js backend with SQLite database.

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

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and the React development server (port 3000).

### Default Admin Credentials
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
3. Fill in the optional metadata fields:
   - Title
   - Description
   - Date
   - Shutter Speed (e.g., "1/1000")
   - ISO (e.g., "100")
   - Focal Length (e.g., "50mm")
   - Aperture (e.g., "f/2.8")
   - Camera Info (e.g., "Canon EOS R5")
4. Click "Upload Photo"

### Managing Photos

- **Edit:** Click the "Edit" button on any photo to modify its metadata
- **Delete:** Click the "Delete" button to remove a photo (with confirmation)
- **View:** All uploaded photos are displayed in the admin panel with thumbnails

### Public Gallery

- The main gallery displays all uploaded photos in an infinite scroll layout
- Click on any photo to view it in a modal with full metadata
- Use drag-to-scroll or mouse wheel to navigate the gallery

## File Structure

```
valokuvauscv/
├── server/
│   └── server.js          # Express backend server
├── src/
│   ├── components/
│   │   ├── AdminPanel.js  # Admin panel component
│   │   ├── Login.js       # Login component
│   │   ├── ImageModal.js  # Photo modal component
│   │   └── ...            # Other existing components
│   ├── App.js             # Main app component
│   └── ...                # Other existing files
├── uploads/               # Uploaded image files (created automatically)
├── photography.db         # SQLite database (created automatically)
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/login` - Admin login

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload new photo (admin only)
- `PUT /api/photos/:id` - Update photo metadata (admin only)
- `DELETE /api/photos/:id` - Delete photo (admin only)

## Security Notes

- Change the default admin password in production
- Update the JWT_SECRET in the server configuration
- Consider implementing rate limiting for production use
- Ensure proper file upload validation and sanitization

## Production Deployment

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Set environment variables:**
   - `JWT_SECRET` - A secure random string
   - `PORT` - Server port (optional, defaults to 5000)

3. **Deploy the server:**
   - The `server.js` file serves the built React app
   - Ensure the `uploads` directory is writable
   - Set up proper database backups for the SQLite file

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
1. Stop the server
2. Delete `photography.db`
3. Restart the server - it will create a new database with default admin user

## Technologies Used

- **Frontend:** React, CSS3
- **Backend:** Express.js, SQLite3
- **Authentication:** JWT, bcryptjs
- **File Upload:** Multer
- **Database:** SQLite

## License

This project is open source and available under the MIT License.
