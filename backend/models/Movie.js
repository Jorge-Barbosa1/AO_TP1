// backend/models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  plot: String,
  fullplot: String,
  year: Number,
  runtime: Number,
  cast: [String],
  poster: String,
  genres: [String],
  directors: [String],
  rated: String,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  }
});

module.exports = mongoose.model('Movie', movieSchema, 'movies');