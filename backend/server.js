const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('login', ({ username, role }, callback) => {
    // Basic auth logic - find or create user
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) {
        return callback({ error: err.message });
      }
      if (row) {
        // User exists
        socket.userId = row.id;
        socket.join(`user_${row.id}`);
        callback({ user: row });
      } else {
        // Create user
        const defaultRole = role === 'police' ? 'police' : 'prisoner';
        db.run("INSERT INTO users (username, role) VALUES (?, ?)", [username, defaultRole], function(err) {
          if (err) {
            return callback({ error: err.message });
          }
          const newUserId = this.lastID;
          db.get("SELECT * FROM users WHERE id = ?", [newUserId], (err, newUser) => {
              if (err) {
                  return callback({ error: err.message });
              }
              socket.userId = newUser.id;
              socket.join(`user_${newUser.id}`);
              callback({ user: newUser });
          });
        });
      }
    });
  });

  const emitUserUpdate = (userId) => {
      db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
          if (!err && user) {
              io.to(`user_${userId}`).emit('user_update', user);
          }
      });
  };

  socket.on('work', (callback) => {
      if (!socket.userId) return callback({ error: "Not logged in" });

      db.get("SELECT stamina, exp, money, role FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });

          if (user.stamina < 20) {
              return callback({ error: "Not enough stamina to work" });
          }

          const moneyGain = user.role === 'police' ? 50 : 20;
          const expGain = 10;
          const staminaCost = 20;

          db.run(
              "UPDATE users SET stamina = stamina - ?, money = money + ?, exp = exp + ? WHERE id = ?",
              [staminaCost, moneyGain, expGain, socket.userId],
              (err) => {
                  if (err) return callback({ error: err.message });
                  emitUserUpdate(socket.userId);
                  callback({ success: true, message: `You worked and earned $${moneyGain} and ${expGain} EXP.` });
              }
          );
      });
  });

  socket.on('steal', (callback) => {
      if (!socket.userId) return callback({ error: "Not logged in" });

      db.get("SELECT stamina, role FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });

          if (user.stamina < 30) {
              return callback({ error: "Not enough stamina to steal" });
          }

          const isCaught = Math.random() < 0.4; // 40% chance to get caught
          const staminaCost = 30;

          if (isCaught) {
              // Caught! Lose money, become prisoner if police
              db.run(
                  "UPDATE users SET stamina = stamina - ?, money = MAX(0, money - 100), role = 'prisoner' WHERE id = ?",
                  [staminaCost, socket.userId],
                  (err) => {
                      if (err) return callback({ error: err.message });
                      emitUserUpdate(socket.userId);
                      callback({ success: false, message: "You were caught stealing! You lost $100 and are now a prisoner." });
                  }
              );
          } else {
              // Success! Gain money
              const moneyGain = 100;
              db.run(
                  "UPDATE users SET stamina = stamina - ?, money = money + ? WHERE id = ?",
                  [staminaCost, moneyGain, socket.userId],
                  (err) => {
                      if (err) return callback({ error: err.message });
                      emitUserUpdate(socket.userId);
                      callback({ success: true, message: `You successfully stole $${moneyGain}!` });
                  }
              );
          }
      });
  });

  // Regenerate stamina over time (simulated via polling from client, or simple interval)
  socket.on('rest', (callback) => {
      if (!socket.userId) return callback({ error: "Not logged in" });

      db.get("SELECT stamina, break_room_level, cell_level, role FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });

          const maxStamina = 100 + (user.role === 'police' ? user.break_room_level * 20 : user.cell_level * 10);
          if (user.stamina >= maxStamina) {
              return callback({ error: "Stamina is already full" });
          }

          const healAmount = user.role === 'police' ? 30 + user.break_room_level * 5 : 20 + user.cell_level * 2;

          db.run(
              "UPDATE users SET stamina = MIN(?, stamina + ?) WHERE id = ?",
              [maxStamina, healAmount, socket.userId],
              (err) => {
                  if (err) return callback({ error: err.message });
                  emitUserUpdate(socket.userId);
                  callback({ success: true, message: `You rested and gained stamina.` });
              }
          );
      });
  });

  socket.on('upgrade_room', (callback) => {
      if (!socket.userId) return callback({ error: "Not logged in" });

      db.get("SELECT money, role, cell_level, break_room_level FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });

          const isPolice = user.role === 'police';
          const currentLevel = isPolice ? user.break_room_level : user.cell_level;
          const cost = currentLevel * 100;

          if (user.money < cost) {
              return callback({ error: `Not enough money. Cost: $${cost}` });
          }

          const upgradeField = isPolice ? 'break_room_level' : 'cell_level';

          db.run(
              `UPDATE users SET money = money - ?, ${upgradeField} = ${upgradeField} + 1 WHERE id = ?`,
              [cost, socket.userId],
              (err) => {
                  if (err) return callback({ error: err.message });
                  emitUserUpdate(socket.userId);
                  callback({ success: true, message: `Upgraded to level ${currentLevel + 1} for $${cost}.` });
              }
          );
      });
  });

  socket.on('craft_weapon', (callback) => {
      if (!socket.userId) return callback({ error: "Not logged in" });

      db.get("SELECT money, weapon FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });

          const cost = 200;
          if (user.money < cost) {
              return callback({ error: `Not enough money to craft weapon. Cost: $${cost}` });
          }

          if (user.weapon !== 'none') {
              return callback({ error: "You already have a weapon." });
          }

          db.run(
              "UPDATE users SET money = money - ?, weapon = 'shiv' WHERE id = ?",
              [cost, socket.userId],
              (err) => {
                  if (err) return callback({ error: err.message });
                  emitUserUpdate(socket.userId);
                  callback({ success: true, message: `Crafted a shiv for $${cost}.` });
              }
          );
      });
  });

  socket.on('switch_role', (callback) => {
      if (!socket.userId) return callback({ error: "Not logged in" });

      db.get("SELECT role, exp, money FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });

          const newRole = user.role === 'police' ? 'prisoner' : 'police';

          if (newRole === 'police' && (user.exp < 100 || user.money < 500)) {
              return callback({ error: "Need 100 EXP and $500 to bribe and become police." });
          }

          const moneyCost = newRole === 'police' ? 500 : 0;

          db.run(
              "UPDATE users SET role = ?, money = money - ? WHERE id = ?",
              [newRole, moneyCost, socket.userId],
              (err) => {
                  if (err) return callback({ error: err.message });
                  emitUserUpdate(socket.userId);
                  callback({ success: true, message: `Role switched to ${newRole}.` });
              }
          );
      });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
