import express from 'express';
import { getQR, getStatus, sendMessageJid } from '../services/whatsappService.js';
const router = express.Router();

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

export default router; 