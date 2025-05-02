const express = require('express');
const router = express.Router();
const Comment = require('../models/Comments');

// GET /api/comments/movie/:movieId
router.get('/movie/:movieId', async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId })
      .sort({ date: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar comentários' });
  }
});

// POST /api/comments/
router.post('/', async (req, res) => {
  const { movieId, username, text } = req.body;

  const comment = new Comment({ movieId, username, text });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Erro ao adicionar comentário' });
  }
});

module.exports = router;