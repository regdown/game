const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'prisoner', -- 'prisoner' or 'police'
        money INTEGER DEFAULT 0,
        exp INTEGER DEFAULT 0,
        stamina INTEGER DEFAULT 100,
        cell_level INTEGER DEFAULT 1,
        break_room_level INTEGER DEFAULT 1,
        weapon TEXT DEFAULT 'none'
    )`, (err) => {
        if (err) {
            console.error('Error creating table', err.message);
        }
    });
  }
});

module.exports = db;
