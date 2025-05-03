// Exemplo corrigido de server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas - Certifique-se de que os caminhos estão corretos
const movieRoutes = require('./routes/movieRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Registrar as rotas CORRETAMENTE - problema comum é aqui
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.send('API Running');
});

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro a conectar ao MongoDB:', err));

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});