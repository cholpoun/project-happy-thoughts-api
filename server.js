import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define port
const port = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Mongoose Schema and Model
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// Routes

// GET /thoughts - Get recent 20 thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch thoughts", error: err });
  }
});

// POST /thoughts - Create a new thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    if (!message || message.length < 5 || message.length > 140) {
      return res.status(400).json({ message: "Invalid message length" });
    }

    const newThought = new Thought({ message });
    await newThought.save();

    res.status(201).json(newThought);
  } catch (err) {
    res.status(500).json({ message: "Could not save thought", error: err });
  }
});

// POST /thoughts/:thoughtId/like - Add a like to a thought
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    thought.hearts += 1;
    await thought.save();

    res.json(thought);
  } catch (err) {
    res.status(500).json({ message: "Could not update hearts", error: err });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Happy Thoughts API");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
