// Serviço para comunicação com o microserviço de Notas Fiscais (microB)
// Implementa chamadas para os endpoints descritos em API_DOCUMENTATION.md
const axios = require('axios');
const env = require('../config/env');

// Usamos a base URL fornecida por env.MICRO_NF_URL. O documento define que a API está sob '/api'.
const api = axios.create({
  baseURL: env.MICRO_NF_URL, // exemplo: https://localhost:5001
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function makeError(err, prefix) {
  if (err.response) {
    const { status, data } = err.response;
    const url = err.config && (err.config.baseURL ? err.config.baseURL + err.config.url : err.config.url);
    const body = typeof data === 'string' && data.length === 0 ? '<empty body>' : data;
    return new Error(`${prefix} - status: ${status} - url: ${url} - body: ${JSON.stringify(body)}`);
  }
  return new Error(`${prefix} - ${err.message}`);
}

module.exports = {
  // ---------- Notas Fiscais (/api/notasfiscais) ----------
  async listarNotas() {
    try {
    const res = await api.get('/notasfiscais');
      return res.data;
    } catch (err) {
      throw makeError(err, 'Erro ao listar notas');
    }
  },

  async obterNotaPorId(id) {
    try {
  const res = await api.get(`/notasfiscais/${id}`);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao obter nota ${id}`);
    }
  },

  async listarNotasPorMedico(medicoId) {
    try {
  const res = await api.get(`/notasfiscais/medico/${medicoId}`);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao listar notas por médico ${medicoId}`);
    }
  },

  async criarNota(nota) {
    try {
  const res = await api.post('/notasfiscais', nota);
      return res.data;
    } catch (err) {
      throw makeError(err, 'Erro ao criar nota');
    }
  },

  async atualizarNota(id, nota) {
    try {
  const res = await api.put(`/notasfiscais/${id}`, nota);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao atualizar nota ${id}`);
    }
  },

  async deletarNota(id) {
    try {
  await api.delete(`/notasfiscais/${id}`);
      return true;
    } catch (err) {
      throw makeError(err, `Erro ao deletar nota ${id}`);
    }
  },

  async notaExiste(id) {
    try {
  const res = await api.get(`/notasfiscais/${id}/exists`);
      return res.data === true;
    } catch (err) {
      throw makeError(err, `Erro ao verificar existência da nota ${id}`);
    }
  },

  // ---------- Faturas (/api/faturas) ----------
  async listarFaturas() {
    try {
  const res = await api.get('/faturas');
      return res.data;
    } catch (err) {
      throw makeError(err, 'Erro ao listar faturas');
    }
  },

  async obterFaturaPorId(id) {
    try {
  const res = await api.get(`/faturas/${id}`);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao obter fatura ${id}`);
    }
  },

  async listarFaturasPorMedico(medicoId) {
    try {
  const res = await api.get(`/faturas/medico/${medicoId}`);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao listar faturas por médico ${medicoId}`);
    }
  },

  async criarFatura(fatura) {
    try {
  const res = await api.post('/faturas', fatura);
      return res.data;
    } catch (err) {
      throw makeError(err, 'Erro ao criar fatura');
    }
  },

  async atualizarFatura(id, fatura) {
    try {
  const res = await api.put(`/faturas/${id}`, fatura);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao atualizar fatura ${id}`);
    }
  },

  async deletarFatura(id) {
    try {
  await api.delete(`/faturas/${id}`);
      return true;
    } catch (err) {
      throw makeError(err, `Erro ao deletar fatura ${id}`);
    }
  },

  async faturaExiste(id) {
    try {
  const res = await api.get(`/faturas/${id}/exists`);
      return res.data === true;
    } catch (err) {
      throw makeError(err, `Erro ao verificar existência da fatura ${id}`);
    }
  },

  async calcularTotalFatura(id) {
    try {
  const res = await api.get(`/faturas/${id}/total`);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao calcular total da fatura ${id}`);
    }
  },

  // ---------- Municipios Aliquota (/api/municipiosaliquota) ----------
  async listarMunicipiosAliquota() {
    try {
  const res = await api.get('/municipiosaliquota');
      return res.data;
    } catch (err) {
      throw makeError(err, 'Erro ao listar municípios/aliquota');
    }
  },

  async obterMunicipioAliquotaPorId(id) {
    try {
  const res = await api.get(`/municipiosaliquota/${id}`);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao obter municipio aliquota ${id}`);
    }
  },

  async obterMunicipioAliquotaPorCodigo(codigo) {
    try {
  const res = await api.get(`/municipiosaliquota/codigo/${codigo}`);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao obter municipio por código ${codigo}`);
    }
  },

  async criarMunicipioAliquota(payload) {
    try {
  const res = await api.post('/municipiosaliquota', payload);
      return res.data;
    } catch (err) {
      throw makeError(err, 'Erro ao criar municipio aliquota');
    }
  },

  async atualizarMunicipioAliquota(id, payload) {
    try {
  const res = await api.put(`/municipiosaliquota/${id}`, payload);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao atualizar municipio aliquota ${id}`);
    }
  },

  async deletarMunicipioAliquota(id) {
    try {
  await api.delete(`/municipiosaliquota/${id}`);
      return true;
    } catch (err) {
      throw makeError(err, `Erro ao deletar municipio aliquota ${id}`);
    }
  },

  async municipioAliquotaExistePorId(id) {
    try {
  const res = await api.get(`/municipiosaliquota/${id}/exists`);
      return res.data === true;
    } catch (err) {
      throw makeError(err, `Erro ao verificar existência do municipio ${id}`);
    }
  },

  async municipioAliquotaExistePorCodigo(codigo) {
    try {
  const res = await api.get(`/municipiosaliquota/codigo/${codigo}/exists`);
      return res.data === true;
    } catch (err) {
      throw makeError(err, `Erro ao verificar existência do municipio por código ${codigo}`);
    }
  },

  // ---------- Impostos Resumo (/api/impostosresumo) ----------
  async listarImpostosResumo() {
    try {
  const res = await api.get('/impostosresumo');
      return res.data;
    } catch (err) {
      throw makeError(err, 'Erro ao listar impostos resumo');
    }
  },

  async obterImpostoResumoPorId(id) {
    try {
  const res = await api.get(`/impostosresumo/${id}`);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao obter imposto resumo ${id}`);
    }
  },

  async listarImpostosResumoPorMedico(medicoId) {
    try {
  const res = await api.get(`/impostosresumo/medico/${medicoId}`);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao listar impostos resumo por médico ${medicoId}`);
    }
  },

  async obterImpostoResumoPorMedicoPeriodo(medicoId, mes, ano) {
    try {
      const res = await api.get(`/impostosresumo/medico/${medicoId}/periodo`, {
        params: { mes, ano },
      });
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao obter imposto resumo por período para médico ${medicoId}`);
    }
  },

  async criarImpostoResumo(payload) {
    try {
  const res = await api.post('/impostosresumo', payload);
      return res.data;
    } catch (err) {
      throw makeError(err, 'Erro ao criar imposto resumo');
    }
  },

  async atualizarImpostoResumo(id, payload) {
    try {
  const res = await api.put(`/impostosresumo/${id}`, payload);
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao atualizar imposto resumo ${id}`);
    }
  },

  async deletarImpostoResumo(id) {
    try {
  await api.delete(`/impostosresumo/${id}`);
      return true;
    } catch (err) {
      throw makeError(err, `Erro ao deletar imposto resumo ${id}`);
    }
  },

  async impostoResumoExiste(id) {
    try {
  const res = await api.get(`/impostosresumo/${id}/exists`);
      return res.data === true;
    } catch (err) {
      throw makeError(err, `Erro ao verificar existência do imposto resumo ${id}`);
    }
  },

  // Calcula e salva/atualiza o resumo: POST /api/impostosresumo/calcular?medicoId=...&mes=...&ano=...
  async calcularImpostoResumo(medicoId, mes, ano) {
    try {
      const res = await api.post('/impostosresumo/calcular', null, {
        params: { medicoId, mes, ano },
      });
      return res.data;
    } catch (err) {
      throw makeError(err, `Erro ao calcular imposto resumo para médico ${medicoId} / ${mes}/${ano}`);
    }
  },
};
