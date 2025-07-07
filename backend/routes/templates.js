const express = require('express');
const router = express.Router();
const { Template, User } = require('../models');

// Get all templates
router.get('/', async (req, res) => {
  const templates = await Template.findAll({ include: [User] });
  res.json(templates);
});

// Get template by id
router.get('/:id', async (req, res) => {
  const template = await Template.findByPk(req.params.id, { include: [User] });
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json(template);
});

// Create template
router.post('/', async (req, res) => {
  try {
    const template = await Template.create(req.body);
    res.status(201).json(template);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update template
router.put('/:id', async (req, res) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  await template.update(req.body);
  res.json(template);
});

// Delete template
router.delete('/:id', async (req, res) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  await template.destroy();
  res.json({ success: true });
});

module.exports = router; 