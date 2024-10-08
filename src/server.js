const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/minesweeper', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Score Schema
const scoreSchema = new mongoose.Schema({
  name: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

const Score = mongoose.model('Score', scoreSchema);

// POST: Add a new score
app.post('/addScore', async (req, res) => {
  const { name, score } = req.body;
  const newScore = new Score({ name, score });
  await newScore.save();
  res.json({ message: 'Score added successfully!' });
});

// GET: Retrieve top 5 scores
app.get('/topScores', async (req, res) => {
  const topScores = await Score.find().sort({ score: -1 }).limit(5);
  res.json(topScores);
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
