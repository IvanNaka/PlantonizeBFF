// Rotas para Notas Fiscais - proxy/CRUD para o microserviço de notas
const express = require('express');
const router = express.Router();
const microB = require('../services/microB.service');
const microA = require('../services/microA.service');

// GET /api/notas -> lista notas fiscais
router.get('/', async (req, res) => {
  try {
    const notas = await microB.listarNotas();
    res.json(notas);
  } catch (err) {
    console.error('Erro listarNotas:', err.message || err);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/notas/:id -> obter nota por id
router.get('/:id', async (req, res) => {
  try {
    const nota = await microB.obterNotaPorId(req.params.id);
    res.json(nota);
  } catch (err) {
    console.error('Erro obterNotaPorId:', err.message || err);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/notas/medico/:medicoId -> listar por médico
router.get('/medico/:medicoId', async (req, res) => {
  try {
    const notas = await microB.listarNotasPorMedico(req.params.medicoId);
    res.json(notas);
  } catch (err) {
    console.error('Erro listarNotasPorMedico:', err.message || err);
    res.status(502).json({ error: err.message });
  }
});

// POST /api/notas -> cria nota fiscal
router.post('/', async (req, res) => {
  try {
    const criado = await microB.criarNota(req.body);
    res.status(201).json(criado);
  } catch (err) {
    console.error('Erro criarNota:', err.message || err);
    res.status(502).json({ error: err.message });
  }
});

// POST /api/notas/emitir -> recebe payload simplificado, busca médico e cria nota no microserviço NF
router.post('/emitir', async (req, res) => {
  try {
    const payload = req.body;
    // Validações mínimas
    if (!payload || !payload.medicoId) return res.status(400).json({ error: 'medicoId é obrigatório' });

    // Busca dados do médico no microserviço de Plantão
    let medico;
    try {
      medico = await microA.obterMedicoPorId(payload.medicoId);
    } catch (err) {
      console.error('Erro ao buscar médico:', err.message || err);
      // tenta detectar 404 no erro upstream
      if (err.message && /404/.test(err.message)) return res.status(404).json({ error: 'Médico não encontrado' });
      return res.status(502).json({ error: 'Erro ao buscar médico' });
    }

    // Monta o body esperado pelo microserviço de Notas Fiscais
    const notaBody = {
      numeroNota: payload.numeroNota,
      dataEmissao: payload.dataEmissao,
      valorTotal: payload.valorTotal,
      status: 1,
      municipioPrestacao: payload.municipioPrestacao,
      issRetido: payload.issRetido,
      medico: {
        id: medico && medico.id ? medico.id : payload.medicoId,
        nome: medico && medico.nome ? medico.nome : undefined,
        cpfCnpj: medico && medico.cpfCnpj ? medico.cpfCnpj : medico && medico.cpf ? medico.cpf : undefined,
        email: medico && medico.email ? medico.email : undefined,
        municipio: medico && medico.municipio ? medico.municipio : undefined,
        inscricaoMunicipal: medico && medico.inscricaoMunicipal ? medico.inscricaoMunicipal : undefined,
        medicoId: medico && medico.id ? medico.id : payload.medicoId,
      },
      tomador: payload.tomador || null,
      // Serviços: aceita array vindo do payload; mapeia campos esperados pelo microserviço
      servicos: Array.isArray(payload.servicos)
        ? payload.servicos.map(s => ({
            descricao: s.descricao,
            quantidade: s.quantidade,
            valorUnitario: s.valorUnitario,
            aliquotaIss: s.aliquotaIss,
          }))
        : [],
      enviadoEmail: false,
    };

    const criado = await microB.criarNota(notaBody);
    return res.status(201).json(criado);
  } catch (err) {
    console.error('Erro emitir nota:', err.message || err);
    return res.status(502).json({ error: err.message });
  }
});

// PUT /api/notas/:id -> atualizar nota
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await microB.atualizarNota(req.params.id, req.body);
    res.json(atualizado);
  } catch (err) {
    console.error('Erro atualizarNota:', err.message || err);
    res.status(502).json({ error: err.message });
  }
});

// DELETE /api/notas/:id -> deletar nota
router.delete('/:id', async (req, res) => {
  try {
    await microB.deletarNota(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error('Erro deletarNota:', err.message || err);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/notas/:id/exists -> verifica existência
router.get('/:id/exists', async (req, res) => {
  try {
    const exists = await microB.notaExiste(req.params.id);
    res.json(exists);
  } catch (err) {
    console.error('Erro notaExiste:', err.message || err);
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
