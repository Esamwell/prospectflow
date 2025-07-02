import express from 'express';
import { Op } from 'sequelize';
import { Lead, Campaign, User, Message } from '../models/index.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.json({ leads: [], campanhas: [], usuarios: [], mensagens: [] });
  try {
    const leads = await Lead.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.substring]: q } },
          { telefone: { [Op.substring]: q } },
          { cidade: { [Op.substring]: q } },
          { categoria: { [Op.substring]: q } },
          { status: { [Op.substring]: q } }
        ]
      },
      limit: 10
    });
    const campanhas = await Campaign.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.substring]: q } },
          { descricao: { [Op.substring]: q } },
          { status: { [Op.substring]: q } }
        ]
      },
      limit: 10
    });
    const usuarios = await User.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.substring]: q } },
          { email: { [Op.substring]: q } }
        ]
      },
      limit: 10
    });
    const mensagens = await Message.findAll({
      where: {
        [Op.or]: [
          { conteudo: { [Op.substring]: q } },
          { resposta: { [Op.substring]: q } }
        ]
      },
      limit: 10
    });
    res.json({ leads, campanhas, usuarios, mensagens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 