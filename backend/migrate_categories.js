const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const db = new sqlite3.Database('photography.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
    migrateDatabase();
  }
});

function migrateDatabase() {
  console.log('Starting category migration...');
  
  // Check if new columns already exist
  db.all("PRAGMA table_info(photos)", (err, columns) => {
    if (err) {
      console.error('Error getting table info:', err);
      return;
    }
    
    const hasIsBlackWhite = columns.some(col => col.name === 'is_black_white');
    const hasCategoryId = columns.some(col => col.name === 'category_id');
    
    console.log('Current photo table columns:', columns.map(col => col.name).join(', '));
    
    if (hasIsBlackWhite && hasCategoryId) {
      console.log('New columns already exist. Checking categories table...');
      checkCategoriesTable();
      return;
    }
    
    console.log('Adding new columns to photos table...');
    
    // Add new columns to photos table
    const addColumns = [];
    if (!hasIsBlackWhite) {
      addColumns.push('ALTER TABLE photos ADD COLUMN is_black_white BOOLEAN DEFAULT 0');
    }
    if (!hasCategoryId) {
      addColumns.push('ALTER TABLE photos ADD COLUMN category_id INTEGER');
    }
    
    // Execute column additions
    let completed = 0;
    addColumns.forEach((sql, index) => {
      console.log('Executing:', sql);
      db.run(sql, (err) => {
        if (err) {
          console.error('Error adding column:', err);
          return;
        }
        completed++;
        console.log(`Column added successfully (${completed}/${addColumns.length})`);
        if (completed === addColumns.length) {
          console.log('Columns added successfully. Creating categories table...');
          createCategoriesTable();
        }
      });
    });
  });
}

function checkCategoriesTable() {
  db.run("SELECT name FROM sqlite_master WHERE type='table' AND name='categories'", (err, row) => {
    if (err) {
      console.error('Error checking categories table:', err);
      return;
    }
    
    if (!row) {
      console.log('Categories table does not exist. Creating it...');
      createCategoriesTable();
    } else {
      console.log('Categories table exists. Checking default categories...');
      checkDefaultCategories();
    }
  });
}

function createCategoriesTable() {
  const createTableSQL = `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`;
  
  console.log('Creating categories table...');
  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating categories table:', err);
      return;
    }
    
    console.log('Categories table created. Adding default categories...');
    addDefaultCategories();
  });
}

function addDefaultCategories() {
  const defaultCategories = ['Portrait', 'Nature', 'Animals', 'Documentary'];
  let completed = 0;
  
  console.log('Adding default categories:', defaultCategories.join(', '));
  
  defaultCategories.forEach(category => {
    db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [category], (err) => {
      if (err) {
        console.error('Error adding category:', err);
        return;
      }
      completed++;
      console.log(`Category "${category}" added (${completed}/${defaultCategories.length})`);
      if (completed === defaultCategories.length) {
        console.log('Default categories added successfully!');
        console.log('Migration completed successfully!');
        db.close();
      }
    });
  });
}

function checkDefaultCategories() {
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) {
      console.error('Error checking categories:', err);
      return;
    }
    
    console.log('Existing categories:', categories.map(c => c.name).join(', '));
    console.log('Migration completed successfully!');
    db.close();
  });
} 