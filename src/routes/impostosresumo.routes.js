// Rotas para Impostos Resumo - proxy para microserviço
const express = require('express');
const router = express.Router();
const microB = require('../services/microB.service');

// GET / -> lista
router.get('/', async (req, res) => {
  try {
    const dados = await microB.listarImpostosResumo();
    res.json(dados);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /:id
router.get('/:id', async (req, res) => {
  try {
    const item = await microB.obterImpostoResumoPorId(req.params.id);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /medico/:medicoId -> lista por médico
router.get('/medico/:medicoId', async (req, res) => {
  try {
    const dados = await microB.listarImpostosResumoPorMedico(req.params.medicoId);
    res.json(dados);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /medico/:medicoId/periodo?mes=&ano=
router.get('/medico/:medicoId/periodo', async (req, res) => {
  try {
    const { mes, ano } = req.query;
    const resumo = await microB.obterImpostoResumoPorMedicoPeriodo(req.params.medicoId, mes, ano);
    res.json(resumo);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// POST / -> criar
router.post('/', async (req, res) => {
  try {
    const criado = await microB.criarImpostoResumo(req.body);
    res.status(201).json(criado);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// PUT /:id -> atualizar
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await microB.atualizarImpostoResumo(req.params.id, req.body);
    res.json(atualizado);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// DELETE /:id -> deletar
router.delete('/:id', async (req, res) => {
  try {
    await microB.deletarImpostoResumo(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /:id/exists
router.get('/:id/exists', async (req, res) => {
  try {
    const exists = await microB.impostoResumoExiste(req.params.id);
    res.json(exists);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// POST /calcular?medicoId=&mes=&ano=
router.post('/calcular', async (req, res) => {
  try {
    const { medicoId, mes, ano } = req.query;
    if (!medicoId || !mes || !ano) {
      return res.status(400).json({ error: 'medicoId, mes e ano são obrigatórios' });
    }
    const resultado = await microB.calcularImpostoResumo(medicoId, mes, ano);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
