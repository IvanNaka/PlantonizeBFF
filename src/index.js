// Entrypoint do BFF - configura middlewares e rotas
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');

// Rotas
const plantoesRoutes = require('./routes/plantoes.routes');
const notasRoutes = require('./routes/notas.routes');
const agregacaoRoutes = require('./routes/agregacao.routes');
const faturasRoutes = require('./routes/faturas.routes');
const municipiosAliquotaRoutes = require('./routes/municipiosaliquota.routes');
const impostosResumoRoutes = require('./routes/impostosresumo.routes');

const app = express();

// Middlewares essenciais
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Rotas base
// Monta conforme documentação do microserviço (singular e com P maiúsculo)
app.use('/api/Plantao', plantoesRoutes);
// Alias legada: manter compatibilidade com consumidores que usam /api/plantoes
app.use('/api/plantoes', plantoesRoutes);
app.use('/api/notas', notasRoutes);
app.use('/api/agregacao', agregacaoRoutes);
app.use('/api/faturas', faturasRoutes);
app.use('/api/municipiosaliquota', municipiosAliquotaRoutes);
app.use('/api/impostosresumo', impostosResumoRoutes);
// Alias para compatibilidade com API_DOCUMENTATION.md (rota original: /api/notasfiscais)
app.use('/api/notasfiscais', notasRoutes);

// Health check simples
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'plantonize-bff' });
});

// Inicia o servidor
const port = env.PORT || 3000;
app.listen(port, () => {
  console.log(`Plantonize BFF rodando na porta ${port}`);
});

module.exports = app;
