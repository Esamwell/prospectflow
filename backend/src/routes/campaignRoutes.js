import express from 'express';
import { Campaign } from '../models/index.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const campaigns = await Campaign.findAll();
  res.json(campaigns);
});

router.get('/:id', async (req, res) => {
  const campaign = await Campaign.findByPk(req.params.id);
  if (campaign) res.json(campaign);
  else res.status(404).json({ error: 'Campanha não encontrada' });
});

router.post('/', async (req, res) => {
  try {
    const nova = await Campaign.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const campaign = await Campaign.findByPk(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada' });
  await campaign.update(req.body);
  res.json(campaign);
});

router.delete('/:id', async (req, res) => {
  const campaign = await Campaign.findByPk(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada' });
  await campaign.destroy();
  res.json({ success: true });
});

export default router; 