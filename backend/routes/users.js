const express = require('express');
const router = express.Router();
const { User, Role, Group } = require('../models');

// Get all users
router.get('/', async (req, res) => {
  const users = await User.findAll({ include: [Role, Group] });
  res.json(users);
});

// Get user by id
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: [Role, Group] });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await user.update(req.body);
  res.json(user);
});

// Delete user
router.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await user.destroy();
  res.json({ success: true });
});

module.exports = router; 