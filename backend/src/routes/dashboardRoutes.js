import express from 'express';
import { Lead, Campaign, Message } from '../models/index.js';
import { Op } from 'sequelize';
const router = express.Router();

router.get('/', async (req, res) => {
  // Total de leads
  const totalLeads = await Lead.count();
  // Soma total de respostas
  const leadsAll = await Lead.findAll({ attributes: ['respostas'] });
  const totalRespostas = leadsAll.reduce((acc, l) => acc + (l.respostas || 0), 0);
  // Taxa de resposta
  const taxaResposta = totalLeads > 0 ? (totalRespostas / totalLeads) * 100 : 0;
  // Leads que responderam pelo menos uma vez (respostas > 0)
  const totalLeadsComResposta = await Lead.count({ where: { respostas: { [Op.gt]: 0 } } });
  // Total de mensagens enviadas
  const totalMensagens = await Message.count();
  // Leads quentes (status = 'quente')
  const leadsQuentes = await Lead.count({ where: { status: 'quente' } });
  // Campanhas recentes (últimas 3)
  const campanhasRecentes = await Campaign.findAll({ order: [['createdAt', 'DESC']], limit: 3 });
  // Atividades recentes (últimas 4 mensagens)
  const atividadesRecentes = await Message.findAll({ order: [['createdAt', 'DESC']], limit: 4, include: [Lead, Campaign] });

  res.json({
    totalLeads,
    totalLeadsComResposta,
    totalRespostas,
    taxaResposta,
    totalMensagens,
    leadsQuentes,
    campanhasRecentes,
    atividadesRecentes
  });
});

export default router; 