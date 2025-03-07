const express = require('express');
const Thought = require('../models/Thought');
const LikedThought = require('../models/LikedThought'); // Import LikedThought model
const router = express.Router();

// 📌 GET /thoughts → Fetch the latest 20 thoughts, sorted by `createdAt` (DESC)
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(thoughts); // Return thoughts
  } catch (error) {
    console.error('Error fetching thoughts:', error); // Log error for debugging
    res.status(500).json({ error: 'Error fetching thoughts' }); // Send 500 error response
  }
});

// 📌 POST /thoughts → Create a new thought
router.post('/', async (req, res) => {
  const { message } = req.body;

  // Validate message length
  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({ error: 'Message must be between 5 and 140 characters' });
  }

  try {
    const newThought = await Thought.create({ message }); // Save the new thought
    res.status(201).json(newThought); // Return the created thought with 201 status
  } catch (error) {
    console.error('Error creating thought:', error); // Log error for debugging
    res.status(500).json({ error: 'Could not save thought' }); // Send 500 error response
  }
});

// 📌 POST /thoughts/:id/like → Increment hearts and store liked thought in LikedThoughts
router.post('/:id/like', async (req, res) => {
  try {
    // Find and update the original thought
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } }, // Increment `hearts` by 1
      { new: true } // Return the updated thought
    );

    if (!updatedThought) {
      return res.status(404).json({ error: 'Thought not found' }); // Handle non-existent thought
    }

    // Save the liked thought in the LikedThoughts collection
    await LikedThought.create({
      thoughtId: updatedThought._id, // Reference the original thought
      message: updatedThought.message, // Copy the message for easier access
      likedAt: new Date(), // Timestamp when the thought was liked
    });

    res.status(200).json(updatedThought); // Return the updated thought
  } catch (error) {
    console.error('Error liking thought:', error); // Log error for debugging
    res.status(500).json({ error: 'Error updating hearts' }); // Send 500 error response
  }
});

module.exports = router;
