const express = require('express');
const Thought = require('../models/Thought');
const router = express.Router();

// 📌 GET /thoughts → Fetch latest 20 thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching thoughts' });
  }
});

// 📌 POST /thoughts → Create a new thought
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({ error: 'Message must be between 5 and 140 characters' });
  }

  try {
    const newThought = await Thought.create({ message });
    res.status(201).json(newThought);
  } catch (error) {
    res.status(500).json({ error: 'Could not save thought' });
  }
});

// 📌 POST /thoughts/:id/like → Increment heart count
router.post('/:id/like', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    res.json(updatedThought);
  } catch (error) {
    res.status(500).json({ error: 'Error updating hearts' });
  }
});

module.exports = router;
