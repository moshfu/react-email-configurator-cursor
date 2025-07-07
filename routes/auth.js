const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, Group } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Register
router.post('/register', async (req, res) => {
  const { username, password, role_id, group_id } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const existing = await User.findOne({ where: { username } });
  if (existing) return res.status(400).json({ error: 'Username already exists' });
  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password_hash, role_id, group_id, must_change_password: false });
  res.status(201).json({ id: user.id, username: user.username });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username }, include: [Role, Group] });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username, role_id: user.role_id, group_id: user.group_id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.Role, group: user.Group } });
});

module.exports = router; 