// Rotas para plantões - proxy/CRUD para o microserviço de plantões
const express = require('express');
const router = express.Router();
const microA = require('../services/microA.service');

// Rotas conforme API_DOCUMENTATION_PLANTAO.md (mounted path assumed in main app)

// GET / -> lista plantões
router.get('/', async (req, res) => {
  try {
    const plantoes = await microA.listarPlantoes();
    res.json(plantoes);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /periodo?dataInicio=..&dataFinal=..
router.get('/periodo', async (req, res) => {
  const { dataInicio, dataFinal } = req.query;
  if (!dataInicio || !dataFinal) return res.status(400).json({ error: 'dataInicio and dataFinal are required' });
  try {
    const plantoes = await microA.listarPlantoesPorPeriodo(dataInicio, dataFinal);
    res.json(plantoes);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /medico/:medicoId
router.get('/medico/:medicoId', async (req, res) => {
  try {
    const items = await microA.listarPlantoesPorMedico(req.params.medicoId);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /hospital/:hospitalId
router.get('/hospital/:hospitalId', async (req, res) => {
  try {
    const items = await microA.listarPlantoesPorHospital(req.params.hospitalId);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /municipio/:municipio
router.get('/municipio/:municipio', async (req, res) => {
  try {
    const items = await microA.listarPlantoesPorMunicipio(req.params.municipio);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /status/:status
router.get('/status/:status', async (req, res) => {
  try {
    const items = await microA.listarPlantoesPorStatus(req.params.status);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// GET /:id -> obter plantão por id
router.get('/:id', async (req, res) => {
  try {
    const item = await microA.obterPlantaoPorId(req.params.id);
    if (!item) return res.status(404).json({ error: 'Plantão não encontrado' });
    res.json(item);
  } catch (err) {
    console.error(err);
    // if upstream returned 404, preserve it
    if (err.message && /404/.test(err.message)) return res.status(404).json({ error: 'Plantão não encontrado' });
    res.status(502).json({ error: err.message });
  }
});

// POST / -> cria plantão
router.post('/', async (req, res) => {
  try {
    const novo = await microA.criarPlantao(req.body);
    // tenta setar Location quando id estiver disponível
    if (novo && novo.id) res.setHeader('Location', `/api/Plantao/${novo.id}`);
    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// PUT /:id -> atualiza plantão
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!req.body || (req.body.id && String(req.body.id) !== String(id))) {
    return res.status(400).json({ error: 'ID no body não corresponde ao ID da URL' });
  }
  try {
    await microA.atualizarPlantao(id, req.body);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

// DELETE /:id -> deleta plantão
router.delete('/:id', async (req, res) => {
  try {
    await microA.deletarPlantao(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
