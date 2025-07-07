const express = require('express');
const router = express.Router();
const { GroupVisibility } = require('../models');

// Get all group visibility links
router.get('/', async (req, res) => {
  const links = await GroupVisibility.findAll();
  res.json(links);
});

// Create a new group visibility link
router.post('/', async (req, res) => {
  try {
    const link = await GroupVisibility.create(req.body);
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a group visibility link
router.delete('/:id', async (req, res) => {
  const link = await GroupVisibility.findByPk(req.params.id);
  if (!link) return res.status(404).json({ error: 'Link not found' });
  await link.destroy();
  res.json({ success: true });
});

module.exports = router; 