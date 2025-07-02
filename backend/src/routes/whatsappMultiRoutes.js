import express from 'express';
import { createSession, getSession, listSessions, sendMessageSession, removeSession } from '../services/whatsappMultiService.js';
const router = express.Router();

// Criar nova sessão
router.post('/create', async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId obrigatório' });
  await createSession(sessionId);
  res.json({ success: true });
});

// Listar sessões
router.get('/list', (req, res) => {
  res.json(listSessions());
});

// Obter QR de uma sessão
router.get('/:sessionId/qr', (req, res) => {
  const session = getSession(req.params.sessionId);
  if (session && session.qr) res.json({ qr: session.qr });
  else res.status(404).json({ error: 'QR Code não disponível' });
});

// Status de uma sessão
router.get('/:sessionId/status', (req, res) => {
  const session = getSession(req.params.sessionId);
  res.json({ connected: !!(session && session.connected) });
});

// Enviar mensagem por sessão
router.post('/:sessionId/send', async (req, res) => {
  const { jid, message } = req.body;
  try {
    await sendMessageSession(req.params.sessionId, jid, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remover sessão
router.delete('/:sessionId', (req, res) => {
  removeSession(req.params.sessionId);
  res.json({ success: true });
});

export default router; 