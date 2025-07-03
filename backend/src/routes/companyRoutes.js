import express from 'express';
import { Company } from '../models/index.js';
const router = express.Router();

// Listar todas as empresas
router.get('/', async (req, res) => {
  const empresas = await Company.findAll();
  res.json(empresas);
});

// Buscar empresa por ID
router.get('/:id', async (req, res) => {
  const empresa = await Company.findByPk(req.params.id);
  if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' });
  res.json(empresa);
});

// Criar nova empresa
router.post('/', async (req, res) => {
  try {
    const empresa = await Company.create(req.body);
    res.status(201).json(empresa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar empresa
router.put('/:id', async (req, res) => {
  const empresa = await Company.findByPk(req.params.id);
  if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' });
  await empresa.update(req.body);
  res.json(empresa);
});

// Remover empresa
router.delete('/:id', async (req, res) => {
  const empresa = await Company.findByPk(req.params.id);
  if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' });
  await empresa.destroy();
  res.json({ success: true });
});

export default router; 