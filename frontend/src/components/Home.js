// frontend/src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const query = useQuery();
  const searchTerm = query.get('search');
  
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = `https://ao-tp1-backend.onrender.com/api/movies?page=${currentPage}`;
        
        if (searchTerm) {
          url = `https://ao-tp1-backend.onrender.com/api/movies/search/${searchTerm}`;
        }
        
        const response = await axios.get(url);
        
        if (searchTerm) {
          setMovies(response.data);
          setTotalPages(1); // Não há paginação para pesquisa neste exemplo simples
        } else {
          setMovies(response.data.movies);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        }
      } catch (err) {
        setError('Erro ao buscar filmes. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [searchTerm, currentPage]);
  
  if (loading) return <div className="loading">A carregar...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="movies-container">
      <h1>{searchTerm ? `Resultados para: ${searchTerm}` : 'Filmes Populares'}</h1>
      
      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map(movie => (
            <Link to={`/movie/${movie._id}`} key={movie._id} className="movie-card">
              <div className="movie-poster">
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} />
                ) : (
                  <div className="no-poster">Sem imagem</div>
                )}
              </div>
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.year}</p>
                <div className="movie-genres">
                  {movie.genres && movie.genres.slice(0, 3).map((genre, index) => (
                    <span key={index}>{genre}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Nenhum filme encontrado.</p>
        )}
      </div>
      
      {!searchTerm && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;