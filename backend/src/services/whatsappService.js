import * as baileys from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import fs from 'fs';
import qrcode from 'qrcode-terminal';

const { makeWASocket, useMultiFileAuthState, DisconnectReason } = baileys;

let sock = null;
let qrCode = null;
let isConnected = false;

export async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth');
  sock = makeWASocket({
    auth: state
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      qrCode = qr;
      // Exibe o QR no terminal
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'close') {
      isConnected = false;
      qrCode = null;
      // Sempre limpar a pasta de autenticação se não estiver conectado
      const statusCode = lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode;
      if (statusCode === DisconnectReason.loggedOut || statusCode === DisconnectReason.connectionClosed || statusCode === DisconnectReason.connectionLost || statusCode === DisconnectReason.restartRequired) {
        try {
          fs.rmSync('baileys_auth', { recursive: true, force: true });
        } catch (e) {}
      }
      startWhatsApp();
    } else if (connection === 'open') {
      isConnected = true;
      qrCode = null;
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

export function getQR() {
  return qrCode;
}

export function getStatus() {
  return isConnected ? 'conectado' : 'desconectado';
}

export async function sendMessageJid(jid, message) {
  if (!sock) throw new Error('WhatsApp não conectado');
  await sock.sendMessage(jid, { text: message });
} 