const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema, 'comments');