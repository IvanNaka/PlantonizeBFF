// Carrega e expõe variáveis de ambiente usadas pelo BFF
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  // Não falha imediatamente — permite usar variáveis de ambiente do ambiente de deploy
  console.warn('Aviso: não foi possível carregar .env local (verifique se existe).');
}

const get = (name, fallback) => process.env[name] || fallback;

module.exports = {
  PORT: get('PORT', 3000),
  MICRO_PLANTAO_URL: get('MICRO_PLANTAO_URL', get('MICRO_A_URL', 'http://localhost:5219')),
  MICRO_NF_URL: get('MICRO_NF_URL', get('MICRO_B_URL', 'http://localhost:5113/api')),
  FUNCTION_EMAIL_URL: get('FUNCTION_EMAIL_URL', ''),
};
