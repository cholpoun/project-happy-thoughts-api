require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const thoughtRoutes = require('./routes/thoughtsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Default API Route
app.get('/', (req, res) => {
  res.json([
    { "path": "/", "methods": ["GET"], "middleware": ["anonymous"] },
    { "path": "/thoughts", "methods": ["GET", "POST"], "middleware": ["anonymous"] },
    { "path": "/thoughts/:id/like", "methods": ["POST"], "middleware": ["anonymous"] }
  ]);
});

// Use Thought Routes
app.use('/thoughts', thoughtRoutes);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
