const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

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

  const generateToken = (userId) => {
      return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
  };

  const verifyToken = (token) => {
      try {
          return jwt.verify(token, JWT_SECRET);
      } catch (e) {
          return null;
      }
  };

  const safeUser = (user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
  }

  socket.on('register', async ({ username, password, role }, callback) => {
      if (!username || !password) return callback({ error: "Username and password required" });

      db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
          if (row) return callback({ error: "Username already exists" });

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const selectedRole = role === 'police' ? 'police' : 'prisoner';

          db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
          [username, hashedPassword, selectedRole], function(err) {
              if (err) return callback({ error: err.message });

              const newUserId = this.lastID;
              db.get("SELECT * FROM users WHERE id = ?", [newUserId], (err, newUser) => {
                  socket.userId = newUser.id;
                  socket.join(`user_${newUser.id}`);
                  const token = generateToken(newUser.id);
                  callback({ user: safeUser(newUser), token, message: "Registration successful!" });
              });
          });
      });
  });

  socket.on('login', async ({ username, password }, callback) => {
      if (!username || !password) return callback({ error: "Username and password required" });

      db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
          if (err || !user) return callback({ error: "Invalid username or password" });

          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) return callback({ error: "Invalid username or password" });

          socket.userId = user.id;
          socket.join(`user_${user.id}`);
          const token = generateToken(user.id);
          callback({ user: safeUser(user), token, message: "Login successful!" });
      });
  });

  socket.on('auto_login', ({ token }, callback) => {
      const decoded = verifyToken(token);
      if (!decoded) return callback({ error: "Session expired. Please log in again." });

      db.get("SELECT * FROM users WHERE id = ?", [decoded.id], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });

          socket.userId = user.id;
          socket.join(`user_${user.id}`);
          callback({ user: safeUser(user), message: "Welcome back!" });
      });
  });

  const emitUserUpdate = (userId) => {
      db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
          if (!err && user) {
              io.to(`user_${userId}`).emit('user_update', safeUser(user));
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

      db.get("SELECT stamina, health, role FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });

          if (user.stamina < 30) {
              return callback({ error: "Not enough stamina to steal" });
          }
          if (user.health <= 0) {
              return callback({ error: "You are too weak! Rest to recover health." });
          }

          const isCaught = Math.random() < 0.4; // 40% chance to get caught
          const staminaCost = 30;

          if (isCaught) {
              // Caught! Lose money, take damage, become prisoner if police
              const damage = 25;
              const moneyLoss = 100;

              db.run(
                  "UPDATE users SET stamina = stamina - ?, money = MAX(0, money - ?), health = MAX(0, health - ?), role = 'prisoner' WHERE id = ?",
                  [staminaCost, moneyLoss, damage, socket.userId],
                  (err) => {
                      if (err) return callback({ error: err.message });
                      emitUserUpdate(socket.userId);
                      callback({ success: false, message: `Busted! Lost $${moneyLoss}, took ${damage} dmg, and sent to prison.` });
                  }
              );
          } else {
              // Success! Gain money
              const moneyGain = Math.floor(Math.random() * 100) + 50; // Random gain between 50-150
              db.run(
                  "UPDATE users SET stamina = stamina - ?, money = money + ? WHERE id = ?",
                  [staminaCost, moneyGain, socket.userId],
                  (err) => {
                      if (err) return callback({ error: err.message });
                      emitUserUpdate(socket.userId);
                      callback({ success: true, message: `Smooth criminal! Stole $${moneyGain}.` });
                  }
              );
          }
      });
  });

  // Regenerate stamina and health
  socket.on('rest', (callback) => {
      if (!socket.userId) return callback({ error: "Not logged in" });

      db.get("SELECT stamina, health, break_room_level, cell_level, role FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });

          const maxStamina = 100 + (user.role === 'police' ? user.break_room_level * 20 : user.cell_level * 10);
          const maxHealth = 100;

          if (user.stamina >= maxStamina && user.health >= maxHealth) {
              return callback({ error: "Stamina and Health are already full." });
          }

          const staminaHeal = user.role === 'police' ? 30 + user.break_room_level * 5 : 20 + user.cell_level * 2;
          const healthHeal = 20;

          db.run(
              "UPDATE users SET stamina = MIN(?, stamina + ?), health = MIN(?, health + ?) WHERE id = ?",
              [maxStamina, staminaHeal, maxHealth, healthHeal, socket.userId],
              (err) => {
                  if (err) return callback({ error: err.message });
                  emitUserUpdate(socket.userId);
                  callback({ success: true, message: `Rested: Recovered Stamina and Health.` });
              }
          );
      });
  });

  socket.on('deposit', (amount, callback) => {
      if (!socket.userId) return callback({ error: "Not logged in" });
      const amt = parseInt(amount);
      if (isNaN(amt) || amt <= 0) return callback({ error: "Invalid amount" });

      db.get("SELECT money FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });
          if (user.money < amt) return callback({ error: "Not enough cash" });

          db.run("UPDATE users SET money = money - ?, bank = bank + ? WHERE id = ?", [amt, amt, socket.userId], (err) => {
              if (err) return callback({ error: err.message });
              emitUserUpdate(socket.userId);
              callback({ success: true, message: `Deposited $${amt} safely in the bank.` });
          });
      });
  });

  socket.on('withdraw', (amount, callback) => {
      if (!socket.userId) return callback({ error: "Not logged in" });
      const amt = parseInt(amount);
      if (isNaN(amt) || amt <= 0) return callback({ error: "Invalid amount" });

      db.get("SELECT bank FROM users WHERE id = ?", [socket.userId], (err, user) => {
          if (err || !user) return callback({ error: "User not found" });
          if (user.bank < amt) return callback({ error: "Not enough in bank" });

          db.run("UPDATE users SET money = money + ?, bank = bank - ? WHERE id = ?", [amt, amt, socket.userId], (err) => {
              if (err) return callback({ error: err.message });
              emitUserUpdate(socket.userId);
              callback({ success: true, message: `Withdrew $${amt} from the bank.` });
          });
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
