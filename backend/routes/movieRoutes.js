//---------------------------------------------------
//  This file defines the routes for the Movie API
//---------------------------------------------------

const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET /api/movies (all)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const movies = await Movie.find().select('title poster year genres').skip(skip).limit(limit);

    const total = await Movie.countDocuments();

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar filmes' });
  }
});

// GET /api/movies/search/:query 
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const movies = await Movie.find({ 
      title: { $regex: searchQuery, $options: 'i' } 
    }).limit(20);
    
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/movies/:id 
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
