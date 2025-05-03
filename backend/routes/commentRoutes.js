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
    res.status(500).json({ message: 'Erro ao procurar comentários' });
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

// PUT /api/comments/:id 
router.put('/:id', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Texto obrigatório' });

    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Comentário não encontrado' });

    res.json(updated);              // devolve o comentário já actualizado
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/comments/:id  ➜ remover comentário
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Comentário não encontrado' });

    res.status(204).end();          // 204 = No Content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;