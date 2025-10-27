// Serviço para comunicação com o microserviço de Plantões
const axios = require('axios');
const env = require('../config/env');

const https = require('https');

// Allow disabling TLS verification for local dev if explicitly enabled in env
const axiosOptions = {
  baseURL: env.MICRO_PLANTAO_URL,
  timeout: 8000,
};

if (String(process.env.ALLOW_INSECURE_TLS).toLowerCase() === 'true') {
  axiosOptions.httpsAgent = new https.Agent({ rejectUnauthorized: false });
}

const api = axios.create(axiosOptions);

function makeError(err, prefix) {
  if (err.response) {
    const { status, data } = err.response;
    const url = err.config && (err.config.baseURL ? err.config.baseURL + err.config.url : err.config.url);
    const body = typeof data === 'string' && data.length === 0 ? '<empty body>' : data;
    return new Error(`${prefix} - status: ${status} - url: ${url} - body: ${JSON.stringify(body)}`);
  }
  if (err.code) {
    return new Error(`${prefix} - code: ${err.code} - message: ${err.message}`);
  }
  return new Error(`${prefix} - ${err.message}`);
}

// Attempt request and optionally fall back between http and https when enabled
async function performRequest(method, path, payload, extraConfig) {
  const cfg = Object.assign({}, extraConfig);
  try {
    const res = await api.request({ method, url: path, data: payload, ...cfg });
    return res;
  } catch (err) {
    // Enable fallback automatically for localhost or when explicitly allowed via env
    const base = String(axiosOptions.baseURL || '');
    const fallbackEnabled = String(process.env.ALLOW_PROTOCOL_FALLBACK).toLowerCase() === 'true' || /localhost|127\.0\.0\.1/.test(base);
    if (!fallbackEnabled) {
      throw makeError(err, `Request ${method.toUpperCase()} ${path}`);
    }

    // compute alternate base (swap http<->https)
    try {
      const original = String(axiosOptions.baseURL || '');
      const alt = original.replace(/^http:/, 'https:').replace(/^https:/, 'http:');
      console.warn(`Request failed (${err.code||err.message}). Falling back to alternate protocol: ${alt}${path}`);

      const altOptions = Object.assign({}, axiosOptions, { baseURL: alt });
      if (String(process.env.ALLOW_INSECURE_TLS).toLowerCase() === 'true') {
        // ensure httpsAgent present to skip verification when using https
        const https = require('https');
        altOptions.httpsAgent = new https.Agent({ rejectUnauthorized: false });
      }

      const altClient = axios.create(altOptions);
      const altRes = await altClient.request({ method, url: path, data: payload, ...cfg });
      return altRes;
    } catch (err2) {
      // If fallback also failed, throw the most informative error
      throw makeError(err2, `Request ${method.toUpperCase()} ${path} (fallback)`);
    }
  }
}

module.exports = {
  // Retorna a lista de plantões do microserviço
  async listarPlantoes() {
    try {
      const res = await performRequest('get', '/api/Plantao');
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao listar plantões: ${JSON.stringify(message)}`);
    }
  },

  async obterPlantaoPorId(id) {
    try {
      const res = await performRequest('get', `/api/Plantao/${id}`);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao obter plantão por id: ${JSON.stringify(message)}`);
    }
  },

  async listarPlantoesPorMedico(medicoId) {
    try {
      const res = await performRequest('get', `/api/Plantao/medico/${medicoId}`);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao listar plantões por médico: ${JSON.stringify(message)}`);
    }
  },

  async listarPlantoesPorHospital(hospitalId) {
    try {
      const res = await performRequest('get', `/api/Plantao/hospital/${hospitalId}`);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao listar plantões por hospital: ${JSON.stringify(message)}`);
    }
  },

  async listarPlantoesPorMunicipio(municipio) {
    try {
      const res = await performRequest('get', `/api/Plantao/municipio/${encodeURIComponent(municipio)}`);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao listar plantões por município: ${JSON.stringify(message)}`);
    }
  },

  async listarPlantoesPorStatus(status) {
    try {
      const res = await performRequest('get', `/api/Plantao/status/${encodeURIComponent(status)}`);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao listar plantões por status: ${JSON.stringify(message)}`);
    }
  },

  async listarPlantoesPorPeriodo(dataInicio, dataFinal) {
    try {
      const query = `dataInicio=${encodeURIComponent(dataInicio)}&dataFinal=${encodeURIComponent(dataFinal)}`;
      const res = await performRequest('get', `/api/Plantao/periodo?${query}`);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao listar plantões por período: ${JSON.stringify(message)}`);
    }
  },

  // Cria um plantão no microserviço
  async criarPlantao(plantao) {
    try {
      const res = await performRequest('post', '/api/Plantao', plantao);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao criar plantão: ${JSON.stringify(message)}`);
    }
  },

  async atualizarPlantao(id, plantao) {
    try {
      const res = await performRequest('put', `/api/Plantao/${id}`, plantao);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao atualizar plantão: ${JSON.stringify(message)}`);
    }
  },

  async deletarPlantao(id) {
    try {
      const res = await performRequest('delete', `/api/Plantao/${id}`);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao deletar plantão: ${JSON.stringify(message)}`);
    }
  },

  // Obtém dados do médico pelo ID (endpoint /api/Medico/{id})
  async obterMedicoPorId(id) {
    try {
      const res = await performRequest('get', `/api/Medico/${id}`);
      return res.data;
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      throw new Error(`Erro ao obter médico por id: ${JSON.stringify(message)}`);
    }
  },
};
