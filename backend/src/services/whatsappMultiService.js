import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import fs from 'fs';
import path from 'path';

const sessions = {};

export async function createSession(sessionId) {
  if (sessions[sessionId]) return sessions[sessionId];
  const dir = path.resolve('baileys_multi', sessionId);
  fs.mkdirSync(dir, { recursive: true });
  const { state, saveCreds } = await useMultiFileAuthState(dir);
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });
  sessions[sessionId] = { sock, qr: null, connected: false };

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      sessions[sessionId].qr = qr;
    }
    if (connection === 'close') {
      sessions[sessionId].connected = false;
      const statusCode = lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode;
      if (statusCode !== DisconnectReason.loggedOut) {
        createSession(sessionId);
      }
    } else if (connection === 'open') {
      sessions[sessionId].connected = true;
      sessions[sessionId].qr = null;
    }
  });
  sock.ev.on('creds.update', saveCreds);
  return sessions[sessionId];
}

export function getSession(sessionId) {
  return sessions[sessionId] || null;
}

export function listSessions() {
  return Object.keys(sessions).map(id => ({
    id,
    connected: sessions[id].connected,
    qr: sessions[id].qr
  }));
}

export async function sendMessageSession(sessionId, jid, message) {
  const session = sessions[sessionId];
  if (!session || !session.connected) throw new Error('Sessão não conectada');
  await session.sock.sendMessage(jid, { text: message });
}

export function removeSession(sessionId) {
  if (sessions[sessionId]) {
    sessions[sessionId].sock.end();
    delete sessions[sessionId];
  }
} 