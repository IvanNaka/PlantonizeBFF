// Rotas para Faturas - proxy/CRUD para o microserviço de faturas
const express = require('express');
const router = express.Router();
const microB = require('../services/microB.service');

// GET /api/faturas -> lista faturas
router.get('/', async (req, res) => {
  try {
    const faturas = await microB.listarFaturas();
    res.json(faturas);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/faturas/:id -> obter fatura
router.get('/:id', async (req, res) => {
  try {
    const fatura = await microB.obterFaturaPorId(req.params.id);
    res.json(fatura);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/faturas/medico/:medicoId -> listar por médico
router.get('/medico/:medicoId', async (req, res) => {
  try {
    const faturas = await microB.listarFaturasPorMedico(req.params.medicoId);
    res.json(faturas);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// POST /api/faturas -> criar
router.post('/', async (req, res) => {
  try {
    const criado = await microB.criarFatura(req.body);
    res.status(201).json(criado);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// PUT /api/faturas/:id -> atualizar
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await microB.atualizarFatura(req.params.id, req.body);
    res.json(atualizado);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// DELETE /api/faturas/:id -> deletar
router.delete('/:id', async (req, res) => {
  try {
    await microB.deletarFatura(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/faturas/:id/exists
router.get('/:id/exists', async (req, res) => {
  try {
    const exists = await microB.faturaExiste(req.params.id);
    res.json(exists);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /api/faturas/:id/total -> calcula total
router.get('/:id/total', async (req, res) => {
  try {
    const total = await microB.calcularTotalFatura(req.params.id);
    res.json(total);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
