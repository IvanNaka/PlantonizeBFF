// Rotas para Municipios Aliquota - proxy para microserviço
const express = require('express');
const router = express.Router();
const microB = require('../services/microB.service');

// GET / -> lista
router.get('/', async (req, res) => {
  try {
    const dados = await microB.listarMunicipiosAliquota();
    res.json(dados);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /:id
router.get('/:id', async (req, res) => {
  try {
    const item = await microB.obterMunicipioAliquotaPorId(req.params.id);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /codigo/:codigo
router.get('/codigo/:codigo', async (req, res) => {
  try {
    const item = await microB.obterMunicipioAliquotaPorCodigo(req.params.codigo);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// POST /
router.post('/', async (req, res) => {
  try {
    const criado = await microB.criarMunicipioAliquota(req.body);
    res.status(201).json(criado);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// PUT /:id
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await microB.atualizarMunicipioAliquota(req.params.id, req.body);
    res.json(atualizado);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    await microB.deletarMunicipioAliquota(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /:id/exists
router.get('/:id/exists', async (req, res) => {
  try {
    const exists = await microB.municipioAliquotaExistePorId(req.params.id);
    res.json(exists);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /codigo/:codigo/exists
router.get('/codigo/:codigo/exists', async (req, res) => {
  try {
    const exists = await microB.municipioAliquotaExistePorCodigo(req.params.codigo);
    res.json(exists);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
