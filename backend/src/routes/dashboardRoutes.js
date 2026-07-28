import express from 'express';
import { Lead, Campaign, Message } from '../models/index.js';
import { Op } from 'sequelize';
const router = express.Router();

router.get('/', async (req, res) => {
  const totalLeads = await Lead.count();
  const leadsQuentes = await Lead.count({ where: { status: 'quente' } });
  const leadsFrios = await Lead.count({ where: { status: 'frio' } });
  const leadsMornos = await Lead.count({ where: { status: 'morno' } });
  const ultimosLeads = await Lead.findAll({ order: [['createdAt', 'DESC']], limit: 5 });

  res.json({
    totalLeads,
    leadsQuentes,
    leadsFrios,
    leadsMornos,
    ultimosLeads
  });
});

export default router; 