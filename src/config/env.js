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
  MICRO_PLANTAO_URL: get('MICRO_PLANTAO_URL', get('MICRO_A_URL', 'https://plantonize-plantao-e4hxc3hja4bpachm.brazilsouth-01.azurewebsites.net/')),
  MICRO_NF_URL: get('MICRO_NF_URL', get('MICRO_B_URL', 'https://plantonize-notasfiscais-ghakhhgwbte9b7hh.brazilsouth-01.azurewebsites.net/api')),
  FUNCTION_EMAIL_URL: get('FUNCTION_EMAIL_URL', ''),
};
