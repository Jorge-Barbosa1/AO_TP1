import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://ao-tp1-backend.onrender.com/api/movies/${id}`);
        setMovie(response.data);
        
        // Fetch comments 
        try {
          const commentsResponse = await axios.get(`https://ao-tp1-backend.onrender.com/api/comments/movie/${id}`);
          setComments(commentsResponse.data);
        } catch (commentsError) {
          console.error('Error fetching comments:', commentsError);
          // Set default empty comments if the endpoint doesn't exist
          setComments([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !username.trim()) return;
    try {
      const response = await axios.post(`https://ao-tp1-backend.onrender.com/api/comments`, {
        movieId: id,
        text: newComment,
        username: username
      });
      
      // Add the new comment to the list
      setComments([response.data, ...comments]);
      
      // Clear the form
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const submitEdit = async () => {
    if (!editText.trim()) return;
    
    try {
      const res = await axios.put(`https://ao-tp1-backend.onrender.com/api/comments/${editingId}`, { 
        text: editText 
      });
      
      setComments(curr => curr.map(c => c._id === editingId ? res.data : c));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error(err);
      alert('Falha ao atualizar comentário.');
    }
  };
  
  const handleDelete = async (commentId) => {
    if (window.confirm('Tem certeza que deseja apagar este comentário?')) {
      try {
        await axios.delete(`https://ao-tp1-backend.onrender.com/api/comments/${commentId}`);
        setComments(curr => curr.filter(c => c._id !== commentId));
      } catch (err) {
        console.error(err);
        alert('Falha ao apagar comentário.');
      }
    }
  };

  if (loading) return <div className="loading">A Carregar...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return <div className="not-found">Filme não encontrado</div>;

  return (
    <div className="movie-detail-container">
      <div className="movie-detail">
        <div className="movie-poster-container">
          <img 
            src={movie.poster || '/placeholder.png'} 
            alt={movie.title} 
            className="movie-detail-poster"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.png';
            }}
          />
        </div>
        <div className="movie-detail-info">
          <h1>{movie.title} <span className="movie-year">({movie.year})</span></h1>
          
          <div className="movie-metadata">
            {movie.rated && <span className="movie-rated">{movie.rated}</span>}
            {movie.runtime && <span className="movie-runtime">{movie.runtime} min</span>}
            {movie.genres && (
              <div className="movie-genres">
                {movie.genres.join(', ')}
              </div>
            )}
          </div>
          
          {movie.directors && (
            <div className="movie-directors">
              <strong>Director:</strong> {movie.directors.join(', ')}
            </div>
          )}
          
          {movie.cast && (
            <div className="movie-cast">
              <strong>Cast:</strong> {movie.cast.join(', ')}
            </div>
          )}
          
          <div className="movie-plot">
            <h3>Plot</h3>
            <p>{movie.plot}</p>
          </div>
          
          {movie.imdb && (
            <div className="movie-ratings">
              <div className="imdb-rating">
                <strong>IMDb Rating:</strong> {movie.imdb.rating}/10 ({movie.imdb.votes.toLocaleString()} votes)
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="comments-section">
        <h2>Comentários</h2>
        
        <div className="comments-list">
          {comments.length === 0 ? (
            <p>Nenhum comentário!</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <strong>{comment.username}</strong>
                  <span className="comment-date">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                  <div className="comment-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => startEdit(comment)}
                    >
                      Editar
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(comment._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                
                {editingId === comment._id ? (
                  <div className="edit-comment-form">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows="3"
                    />
                    <div className="edit-buttons">
                      <button onClick={submitEdit} className="save-btn">Guardar</button>
                      <button onClick={cancelEdit} className="cancel-btn">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <p>{comment.text}</p>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="comment-form">
          <h3>Adicionar Comentário</h3>
          <form onSubmit={handleSubmitComment}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comentário:</label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows="4"
              />
            </div>
            <button type="submit" className="submit-btn">Criar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;