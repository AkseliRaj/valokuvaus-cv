# Photography Portfolio Backend

Express.js backend server for the photography portfolio with admin panel functionality.

## Features

- **Authentication**: JWT-based admin login system
- **File Upload**: Image upload with metadata support
- **Database**: SQLite database for photos and users
- **API**: RESTful API endpoints for CRUD operations
- **Production Ready**: Serves React frontend in production

## Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Start production server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/login` - Admin login

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload new photo (admin only)
- `PUT /api/photos/:id` - Update photo metadata (admin only)
- `DELETE /api/photos/:id` - Delete photo (admin only)

## Environment Variables

- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## Database

The server automatically creates:
- `photography.db` - SQLite database
- `uploads/` - Directory for uploaded images
- Default admin user (admin/admin123)

## File Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── photography.db     # SQLite database (created automatically)
├── uploads/          # Uploaded images (created automatically)
└── README.md         # This file
```

## Development

The server runs on `http://localhost:5000` by default.

For development, the frontend should run on a different port (e.g., 3000) and communicate with the backend via API calls.

## Production

In production mode (`NODE_ENV=production`), the server will:
1. Serve the React frontend from `../frontend/build`
2. Handle all routes through the React app
3. Provide API endpoints at `/api/*`

## Security Notes

- Change default admin password in production
- Set a strong JWT_SECRET
- Consider implementing rate limiting
- Ensure proper file upload validation 