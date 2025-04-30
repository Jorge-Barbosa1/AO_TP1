import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';
//import Search from './components/Search';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
             {/* <Route path="/search/:query" element={<Search />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;