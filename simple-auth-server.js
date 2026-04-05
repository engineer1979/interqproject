const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('users.db'); // Persistent DB
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          res.status(400).json({ message: 'Username already exists' });
        } else {
          res.status(500).json({ message: 'Database error' });
        }
      } else {
        res.status(201).json({ message: 'User created successfully' });
      }
    });
    stmt.finalize();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password endpoint
app.post('/forgot-password', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and new password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("UPDATE users SET password = ? WHERE username = ?");
    stmt.run(hashedPassword, username, function(err) {
      if (err) {
        res.status(500).json({ message: 'Database error' });
      } else if (this.changes === 0) {
        res.status(400).json({ message: 'User not found' });
      } else {
        res.json({ message: 'Password updated successfully' });
      }
    });
    stmt.finalize();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Simple auth server running on http://localhost:${PORT}`);
});

