import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie._id}`} className="movie-card-link">
      <div className="movie-card">
        <img 
          src={movie.poster || '/placeholder.png'} 
          alt={movie.title} 
          className="movie-poster"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.png';
          }}
        />
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">{movie.year}</p>
          <div className="movie-genres">
            {movie.genres && movie.genres.map((genre, index) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;