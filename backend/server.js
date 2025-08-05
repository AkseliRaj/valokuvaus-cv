const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Database setup
const db = new sqlite3.Database('photography.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

// Create tables
function createTables() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Photos table
    db.run(`CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      title TEXT,
      description TEXT,
      date TEXT,
      shutter_speed TEXT,
      iso TEXT,
      focal_length TEXT,
      aperture TEXT,
      camera_info TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create default admin user
    const defaultPassword = 'admin123';
    bcrypt.hash(defaultPassword, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return;
      }
      
      db.get('SELECT id FROM users WHERE username = ?', ['admin'], (err, row) => {
        if (err) {
          console.error('Error checking admin user:', err);
          return;
        }
        
        if (!row) {
          db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hash], (err) => {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('Default admin user created - Username: admin, Password: admin123');
            }
          });
        }
      });
    });
  });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// API Routes

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Authentication error' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, username: user.username } });
    });
  });
});

// Get all photos
app.get('/api/photos', (req, res) => {
  db.all('SELECT * FROM photos ORDER BY created_at DESC', (err, photos) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(photos);
  });
});

// Upload photo (admin only)
app.post('/api/photos', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const {
    title,
    description,
    date,
    shutter_speed,
    iso,
    focal_length,
    aperture,
    camera_info
  } = req.body;

  const filename = req.file.filename;
  const originalName = req.file.originalname;

  db.run(
    `INSERT INTO photos (filename, original_name, title, description, date, shutter_speed, iso, focal_length, aperture, camera_info)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [filename, originalName, title, description, date, shutter_speed, iso, focal_length, aperture, camera_info],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        id: this.lastID,
        filename,
        original_name: originalName,
        title,
        description,
        date,
        shutter_speed,
        iso,
        focal_length,
        aperture,
        camera_info
      });
    }
  );
});

// Delete photo (admin only)
app.delete('/api/photos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT filename FROM photos WHERE id = ?', [id], (err, photo) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, 'uploads', photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    db.run('DELETE FROM photos WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Photo deleted successfully' });
    });
  });
});

// Update photo (admin only)
app.put('/api/photos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    shutter_speed,
    iso,
    focal_length,
    aperture,
    camera_info
  } = req.body;

  db.run(
    `UPDATE photos SET title = ?, description = ?, date = ?, shutter_speed = ?, iso = ?, focal_length = ?, aperture = ?, camera_info = ?
     WHERE id = ?`,
    [title, description, date, shutter_speed, iso, focal_length, aperture, camera_info, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Photo not found' });
      }
      
      res.json({ message: 'Photo updated successfully' });
    }
  );
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend served from ../frontend/build`);
  }
}); 