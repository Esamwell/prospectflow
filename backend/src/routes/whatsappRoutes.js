import express from 'express';
import { getQR, getStatus, sendMessageJid } from '../services/whatsappService.js';
import { getStatus as getStatusWeb, getQRWeb, createSession, listSessions, getSessionStatus, sendMessageSession } from '../services/whatsappWebService.js';
import { Lead, Message } from '../models/index.js';
import multer from 'multer';
import path from 'path';
import pkg from 'whatsapp-web.js';
import fs from 'fs';
const { MessageMedia } = pkg;

const router = express.Router();

const upload = multer({ dest: path.join(process.cwd(), 'backend/uploads') });

router.get('/status', (req, res) => {
  res.json({ status: getStatus() });
});

router.get('/qr', (req, res) => {
  const qr = getQR();
  if (qr) res.json({ qr });
  else res.status(404).json({ error: 'QR Code não disponível' });
});

router.post('/send', async (req, res) => {
  const { jid, message } = req.body;
  if (!jid || !message) return res.status(400).json({ error: 'jid e message obrigatórios' });
  try {
    await sendMessageJid(jid, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/qr-web', (req, res) => {
  const qr = getQRWeb ? getQRWeb() : null;
  if (qr) res.json({ qr });
  else res.status(404).json({ error: 'QR Code não disponível' });
});

// Listar conversas (leads com mensagens)
router.get('/conversas-web', async (req, res) => {
  try {
    const leads = await Lead.findAll({
      include: [{ model: Message, required: true }],
      order: [['updatedAt', 'DESC']],
    });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar mensagens de um lead
router.get('/mensagens-web/:leadId', async (req, res) => {
  try {
    const mensagens = await Message.findAll({
      where: { leadId: req.params.leadId },
      order: [['createdAt', 'ASC']],
    });
    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status/qualidade do lead
router.post('/lead-status/:leadId', async (req, res) => {
  const { status } = req.body;
  if (!['frio', 'morno', 'quente'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }
  try {
    const lead = await Lead.findByPk(req.params.leadId);
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });
    await lead.update({ status });
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar nova sessão
router.post('/session', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'ID da sessão obrigatório' });
  createSession(id);
  res.json({ success: true });
});

// Listar sessões
router.get('/sessions', (req, res) => {
  res.json(listSessions());
});

// Status/QR de uma sessão
router.get('/session/:id', (req, res) => {
  const status = getSessionStatus(req.params.id);
  if (!status) return res.status(404).json({ error: 'Sessão não encontrada' });
  res.json(status);
});

// Enviar mensagem por sessão
router.post('/session/:id/send', async (req, res) => {
  const { jid, message } = req.body;
  if (!jid || !message) return res.status(400).json({ error: 'jid e message obrigatórios' });
  try {
    await sendMessageSession(req.params.id, jid, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar conversas (leads) de uma sessão
router.get('/:sessionId/conversas', async (req, res) => {
  try {
    const leads = await Lead.findAll({
      include: [{ model: Message, required: true, where: { sessionId: req.params.sessionId } }],
      order: [['updatedAt', 'DESC']],
    });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar mensagens de um lead em uma sessão
router.get('/:sessionId/mensagens/:leadId', async (req, res) => {
  try {
    const mensagens = await Message.findAll({
      where: { leadId: req.params.leadId, sessionId: req.params.sessionId },
      order: [['createdAt', 'ASC']],
    });
    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enviar mídia por sessão
router.post('/session/:id/send-media', upload.single('file'), async (req, res) => {
  const { jid } = req.body;
  console.log('Recebendo upload de mídia...');
  if (!jid || !req.file) {
    console.error('jid ou arquivo ausente', { jid, file: !!req.file });
    return res.status(400).json({ error: 'jid e arquivo obrigatórios' });
  }
  try {
    const filePath = req.file.path;
    const mimetype = req.file.mimetype;
    console.log('Arquivo recebido:', filePath, mimetype);
    const data = fs.readFileSync(filePath, { encoding: 'base64' });
    const media = new MessageMedia(mimetype, data, req.file.originalname);
    console.log('Enviando mídia para o WhatsApp...');
    await sendMessageSession(req.params.id, jid, media);
    console.log('Mídia enviada com sucesso!');
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao enviar mídia:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router; 