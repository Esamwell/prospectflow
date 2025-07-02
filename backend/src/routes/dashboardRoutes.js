import express from 'express';
import { Lead, Campaign, Message } from '../models/index.js';
import { Op } from 'sequelize';
const router = express.Router();

router.get('/', async (req, res) => {
  // Total de leads
  const totalLeads = await Lead.count();
  // Total de mensagens enviadas
  const totalMensagens = await Message.count();
  // Taxa de resposta (mensagens com resposta / total de mensagens)
  const totalRespostas = await Message.count({ where: { resposta: { [Op.ne]: null } } });
  const taxaResposta = totalMensagens > 0 ? (totalRespostas / totalMensagens) * 100 : 0;
  // Leads quentes (status = 'quente')
  const leadsQuentes = await Lead.count({ where: { status: 'quente' } });
  // Campanhas recentes (últimas 3)
  const campanhasRecentes = await Campaign.findAll({ order: [['createdAt', 'DESC']], limit: 3 });
  // Atividades recentes (últimas 4 mensagens)
  const atividadesRecentes = await Message.findAll({ order: [['createdAt', 'DESC']], limit: 4, include: [Lead, Campaign] });

  res.json({
    totalLeads,
    totalMensagens,
    taxaResposta,
    leadsQuentes,
    campanhasRecentes,
    atividadesRecentes
  });
});

export default router; 