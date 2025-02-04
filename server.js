require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const thoughtRoutes = require('./routes/thoughtsRoutes');

const app = express();

// 📌 Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// 📌 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the server if the database connection fails
  });

// 📌 Default API Route
app.get('/', (req, res) => {
  res.json([
    { "path": "/", "methods": ["GET"], "middleware": ["anonymous"] },
    { "path": "/thoughts", "methods": ["GET", "POST"], "middleware": ["anonymous"] },
    { "path": "/thoughts/:id/like", "methods": ["POST"], "middleware": ["anonymous"] }
  ]);
});

// 📌 Use Thought Routes
app.use('/thoughts', thoughtRoutes);

// 📌 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res.status(500).json({ error: 'An internal server error occurred.' });
});

// 📌 Start the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
