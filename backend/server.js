// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const movieRoutes = require('./routes/movieRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar:', err));

// IMPORTANTE: Definir rotas de API ANTES de servir arquivos estáticos
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentRoutes);

// Adicione uma rota de teste para verificar se a API está funcionando
app.get('/api/test', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

// Servir arquivos estáticos do frontend em produção
// IMPORTANTE: Isso deve vir DEPOIS das rotas de API
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Para qualquer rota que não seja de API, serve o index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));