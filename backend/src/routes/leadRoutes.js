import express from 'express';
import { Lead } from '../models/index.js';
const router = express.Router();

// Listar todos os leads
router.get('/', async (req, res) => {
  const leads = await Lead.findAll();
  res.json(leads);
});

// Buscar lead por ID
router.get('/:id', async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  if (lead) res.json(lead);
  else res.status(404).json({ error: 'Lead não encontrado' });
});

// Criar novo lead
router.post('/', async (req, res) => {
  try {
    const novo = await Lead.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar lead
router.put('/:id', async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });
  await lead.update(req.body);
  res.json(lead);
});

// Remover lead
router.delete('/:id', async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });
  await lead.destroy();
  res.json({ success: true });
});

export default router; 