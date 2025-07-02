import express from 'express';
import { Followup } from '../models/index.js';
const router = express.Router();

// Listar follow-ups de uma campanha
router.get('/campaign/:campaignId', async (req, res) => {
  const followups = await Followup.findAll({ where: { campaignId: req.params.campaignId }, order: [['ordem', 'ASC']] });
  res.json(followups);
});

// Criar novo follow-up
router.post('/', async (req, res) => {
  try {
    const novo = await Followup.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar follow-up
router.put('/:id', async (req, res) => {
  const followup = await Followup.findByPk(req.params.id);
  if (!followup) return res.status(404).json({ error: 'Follow-up não encontrado' });
  await followup.update(req.body);
  res.json(followup);
});

// Remover follow-up
router.delete('/:id', async (req, res) => {
  const followup = await Followup.findByPk(req.params.id);
  if (!followup) return res.status(404).json({ error: 'Follow-up não encontrado' });
  await followup.destroy();
  res.json({ success: true });
});

export default router; 