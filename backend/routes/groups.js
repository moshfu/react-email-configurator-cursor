const express = require('express');
const router = express.Router();
const { Group } = require('../models');

// Get all groups
router.get('/', async (req, res) => {
  const groups = await Group.findAll();
  res.json(groups);
});

// Get group by id
router.get('/:id', async (req, res) => {
  const group = await Group.findByPk(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  res.json(group);
});

// Create group
router.post('/', async (req, res) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update group
router.put('/:id', async (req, res) => {
  const group = await Group.findByPk(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  await group.update(req.body);
  res.json(group);
});

// Delete group
router.delete('/:id', async (req, res) => {
  const group = await Group.findByPk(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  await group.destroy();
  res.json({ success: true });
});

module.exports = router; 