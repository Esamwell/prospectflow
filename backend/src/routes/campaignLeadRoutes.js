import express from 'express';
import { CampaignLead, Lead } from '../models/index.js';
const router = express.Router();

// Listar leads de uma campanha
router.get('/:campaignId', async (req, res) => {
  const leads = await CampaignLead.findAll({
    where: { campaignId: req.params.campaignId },
    include: [Lead]
  });
  res.json(leads.map(cl => ({
    ...cl.Lead.dataValues,
    campaignLeadId: cl.id
  })));
});

// Adicionar lead a campanha
router.post('/', async (req, res) => {
  const { campaignId, leadId } = req.body;
  if (!campaignId || !leadId) return res.status(400).json({ error: 'campaignId e leadId obrigatórios' });
  const cl = await CampaignLead.create({ campaignId, leadId });
  res.status(201).json(cl);
});

// Remover lead de campanha
router.delete('/:id', async (req, res) => {
  const cl = await CampaignLead.findByPk(req.params.id);
  if (!cl) return res.status(404).json({ error: 'Associação não encontrada' });
  await cl.destroy();
  res.json({ success: true });
});

export default router; 