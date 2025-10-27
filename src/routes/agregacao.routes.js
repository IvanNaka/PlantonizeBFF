// Rotas de agregação - compõe dados de plantoes + notas e chama Azure Function
const express = require('express');
const router = express.Router();
const microA = require('../services/microA.service');
const microB = require('../services/microB.service');
const funcService = require('../services/function.service');

// GET /api/agregacao/dashboard -> retorna resumo agregado
router.get('/dashboard', async (req, res) => {
  try {
    const [plantoes, notas] = await Promise.all([
      microA.listarPlantoes(),
      microB.listarNotas(),
    ]);

    // Exemplo de resumo simples
    const totalPlantoes = Array.isArray(plantoes) ? plantoes.length : 0;
    const totalNotas = Array.isArray(notas) ? notas.length : 0;

    // Agregação por médico (se estrutura permitir)
    const notasPorMedico = {};
    if (Array.isArray(notas)) {
      notas.forEach((n) => {
        const medico = n.medico || 'desconhecido';
        notasPorMedico[medico] = (notasPorMedico[medico] || 0) + 1;
      });
    }

    res.json({ totalPlantoes, totalNotas, notasPorMedico, plantoes, notas });
  } catch (err) {
    console.error('Erro na agregação:', err);
    res.status(502).json({ error: err.message });
  }
});

// POST /api/agregacao/enviar-nota -> envia nota por e-mail via Azure Function
router.post('/enviar-nota', async (req, res) => {
  const nota = req.body;
  if (!nota) {
    return res.status(400).json({ error: 'Payload de nota obrigatório' });
  }

  try {
    const resultado = await funcService.enviarNotaPorEmail(nota);
    res.json({ success: true, resultado });
  } catch (err) {
    console.error('Erro ao enviar nota via function:', err);
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
