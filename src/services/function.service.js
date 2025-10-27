// Serviço para chamar a Azure Function responsável por enviar notas por e-mail
const axios = require('axios');
const env = require('../config/env');

const api = axios.create({
  baseURL: env.FUNCTION_EMAIL_URL,
  timeout: 10000,
});

module.exports = {
  // Envia a nota para a Azure Function que dispara o e-mail
  async enviarNotaPorEmail(nota) {
    if (!env.FUNCTION_EMAIL_URL) {
      throw new Error('FUNCTION_EMAIL_URL não configurada');
    }

    try {
      // A Azure Function espera receber o payload da nota no corpo
      const res = await api.post('', nota);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao enviar nota por e-mail: ${JSON.stringify(message)}`);
    }
  },
};
