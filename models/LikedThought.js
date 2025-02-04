const mongoose = require('mongoose');

const LikedThoughtSchema = new mongoose.Schema({
  thoughtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thought',
    required: true, // Reference to the original Thought
  },
  message: {
    type: String,
    required: true, // Save the thought message for quick access
  },
  likedAt: {
    type: Date,
    default: Date.now, // Timestamp for when the thought was liked
  },
});

module.exports = mongoose.model('LikedThought', LikedThoughtSchema);
