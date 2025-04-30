const express = require('express');
const router = express.Router();
const Comment = require('../models/Comments');

// Get all comments for a specific movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId })
      .sort({ date: -1 });
    
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new comment
router.post('/', async (req, res) => {
  const comment = new Comment({
    movieId: req.body.movieId,
    username: req.body.username,
    text: req.body.text
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;