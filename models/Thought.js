const mongoose = require('mongoose');

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [5, "Message must be at least 5 characters"],
    maxlength: [140, "Message must be at most 140 characters"],
  },
  hearts: {
    type: Number,
    default: 0,  
  },
  createdAt: {
    type: Date,
    default: Date.now, // Auto-generated timestamp
  },
});

module.exports = mongoose.model('Thought', ThoughtSchema);
