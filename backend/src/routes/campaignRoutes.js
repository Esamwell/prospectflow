import express from 'express';
import { Campaign, Lead, Company, CampaignLead } from '../models/index.js';
import { sendMessageSession } from '../services/whatsappWebService.js';
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

// Iniciar automação inteligente da campanha
router.post('/:id/start', async (req, res) => {
  try {
    const campanha = await Campaign.findByPk(req.params.id, { include: [Company] });
    if (!campanha) return res.status(404).json({ error: 'Campanha não encontrada' });
    if (campanha.status === 'pausada') return res.status(400).json({ error: 'Campanha está pausada. Retome para continuar.' });
    if (campanha.status === 'encerrada') return res.status(400).json({ error: 'Campanha está encerrada.' });
    const leads = await CampaignLead.findAll({ where: { campaignId: campanha.id, status: 'novo' } });
    if (!leads.length) return res.status(400).json({ error: 'Nenhum lead novo para disparo nesta campanha' });
    const empresa = campanha.Company;
    if (!empresa) return res.status(400).json({ error: 'Perfil de empresa não encontrado' });
    for (const cl of leads) {
      const lead = await Lead.findByPk(cl.leadId);
      if (!lead) continue;
      // Mensagem personalizada
      const mensagem = `Olá, ${lead.nome}! Aqui é ${empresa.representante} da ${empresa.nome}. Atuamos com ${empresa.produtos_servicos}. Gostaria de conversar rapidamente para entender como podemos ajudar sua empresa? Se preferir, podemos agendar uma reunião. Fique à vontade para responder!`;
      try {
        await sendMessageSession(campanha.sessionId, lead.telefone + '@c.us', mensagem);
        // Atualizar status do lead na campanha
        cl.status = 'aguardando_resposta';
        cl.ultima_interacao = new Date();
        cl.tentativas = (cl.tentativas || 0) + 1;
        await cl.save();
      } catch (err) {
        console.error('Erro ao enviar mensagem para lead', lead.telefone, err.message);
      }
    }
    res.json({ success: true, message: 'Mensagens enviadas para leads novos.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pausar campanha
router.post('/:id/pause', async (req, res) => {
  try {
    const campanha = await Campaign.findByPk(req.params.id);
    if (!campanha) return res.status(404).json({ error: 'Campanha não encontrada' });
    campanha.status = 'pausada';
    await campanha.save();
    res.json({ success: true, message: 'Campanha pausada.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Encerrar campanha
router.post('/:id/close', async (req, res) => {
  try {
    const campanha = await Campaign.findByPk(req.params.id);
    if (!campanha) return res.status(404).json({ error: 'Campanha não encontrada' });
    campanha.status = 'encerrada';
    await campanha.save();
    res.json({ success: true, message: 'Campanha encerrada.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 