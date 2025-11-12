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

// Swagger UI (documentação)
let swaggerUi;
let swaggerDocument;
try {
  swaggerUi = require('swagger-ui-express');
  swaggerDocument = require('./swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Rota de documentação disponível em /api-docs');
} catch (e) {
  // Caso a dependência não esteja instalada (ex.: ambiente de produção mínimo), apenas logamos
  console.warn('Aviso: swagger-ui-express não está instalado. Para habilitar a documentação, instale a dependência.');
}

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
// Prioriza a variável de ambiente fornecida pelo ambiente de execução (ex.: Azure App Service)
const desiredPort = process.env.PORT || env.PORT || 3000;

const server = app.listen(desiredPort, () => {
  console.log(`Plantonize BFF rodando na porta ${desiredPort}`);
  if (process.env.PORT) {
    console.log('Usando porta fornecida por ambiente (process.env.PORT).');
  } else {
    console.log('process.env.PORT não definida — usando valor de fallback. Em produção prefira configurar a variável de ambiente PORT no App Service.');
  }
});

server.on('error', (err) => {
  // Tratamento explícito para EADDRINUSE — útil ao debugar deploys no Azure
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Erro: porta ${desiredPort} já está em uso (EADDRINUSE).`);
    console.error('Possíveis causas: outra instância da aplicação já está rodando, ou o App Service configurou um processo que escuta a mesma porta.');
    console.error('Soluções: configure a variável de ambiente PORT no Azure App Settings para o valor correto, ou interrompa o processo que está usando a porta.');
    // Saímos com código de erro para que a plataforma possa tentar reiniciar ou reportar falha
    process.exit(1);
  }
  console.error('Erro no servidor:', err);
  process.exit(1);
});

module.exports = app;
