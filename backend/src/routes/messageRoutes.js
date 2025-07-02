import express from 'express';
import { Message } from '../models/index.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const messages = await Message.findAll();
  res.json(messages);
});

router.get('/:id', async (req, res) => {
  const message = await Message.findByPk(req.params.id);
  if (message) res.json(message);
  else res.status(404).json({ error: 'Mensagem não encontrada' });
});

router.post('/', async (req, res) => {
  try {
    const nova = await Message.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const message = await Message.findByPk(req.params.id);
  if (!message) return res.status(404).json({ error: 'Mensagem não encontrada' });
  await message.update(req.body);
  res.json(message);
});

router.delete('/:id', async (req, res) => {
  const message = await Message.findByPk(req.params.id);
  if (!message) return res.status(404).json({ error: 'Mensagem não encontrada' });
  await message.destroy();
  res.json({ success: true });
});

export default router; 