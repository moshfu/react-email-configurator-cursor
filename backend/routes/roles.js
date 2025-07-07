const express = require('express');
const router = express.Router();
const { Role } = require('../models');

// Get all roles
router.get('/', async (req, res) => {
  const roles = await Role.findAll();
  res.json(roles);
});

// Get role by id
router.get('/:id', async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });
  res.json(role);
});

// Create role
router.post('/', async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });
  await role.update(req.body);
  res.json(role);
});

// Delete role
router.delete('/:id', async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });
  await role.destroy();
  res.json({ success: true });
});

module.exports = router; 