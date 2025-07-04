import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import { Lead, Message, CampaignLead, Campaign, Company } from '../models/index.js';
import { Op } from 'sequelize';

const sessions = {};
const SESSIONS_FILE = './sessions.json';

// Carregar sessões salvas ao iniciar
export function loadSessions() {
  if (fs.existsSync(SESSIONS_FILE)) {
    const ids = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
    ids.forEach(id => createSession(id));
  }
}

function saveSessionId(id) {
  let ids = [];
  if (fs.existsSync(SESSIONS_FILE)) {
    ids = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
  }
  if (!ids.includes(id)) {
    ids.push(id);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(ids));
  }
}

export function createSession(sessionId) {
  if (sessions[sessionId]) return sessions[sessionId];
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: sessionId }),
  });
  sessions[sessionId] = {
    client,
    status: 'desconectado',
    qr: null,
  };
  saveSessionId(sessionId);

  client.on('qr', (qr) => {
    sessions[sessionId].qr = qr;
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    sessions[sessionId].status = 'conectado';
    sessions[sessionId].qr = null;
    console.log(`Sessão ${sessionId} conectada!`);
  });

  client.on('disconnected', () => {
    sessions[sessionId].status = 'desconectado';
    sessions[sessionId].qr = null;
    console.log(`Sessão ${sessionId} desconectada!`);
  });

  client.on('message', async (msg) => {
    try {
      const jid = msg.from;
      const telefone = jid.replace(/@c\.us$/, '');
      const contact = await sessions[sessionId].client.getContactById(jid);
      const nomeContato = contact.pushname || contact.name || telefone;
      let fotoContato = null;
      try { fotoContato = await contact.getProfilePicUrl(); } catch {}
      let lead = await Lead.findOne({ where: { telefone } });
      if (!lead) {
        lead = await Lead.create({ nome: nomeContato, telefone, foto: fotoContato, whatsapp: true, ultimoContato: new Date(), respostas: 1 });
      } else {
        const novasRespostas = (lead.respostas || 0) + 1;
        await lead.update({ nome: nomeContato, foto: fotoContato, ultimoContato: new Date(), respostas: novasRespostas });
      }
      // --- SUPORTE A MÍDIA ---
      let conteudo = msg.body;
      let tipo = 'texto';
      let caminhoArquivo = null;
      if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        if (media) {
          const ext = media.mimetype.split('/')[1];
          const nomeArquivo = `media_${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`;
          const caminho = `./uploads/${nomeArquivo}`;
          require('fs').writeFileSync(caminho, media.data, 'base64');
          caminhoArquivo = caminho.replace('./', '/');
          tipo = media.mimetype.startsWith('image') ? 'imagem' : media.mimetype.startsWith('audio') ? 'audio' : media.mimetype;
          conteudo = `[Arquivo: ${nomeArquivo}]`;
        }
      }
      await Message.create({
        leadId: lead.id,
        conteudo,
        tipo,
        caminhoArquivo,
        enviada: false,
        dataEnvio: new Date(),
        sessionId: sessionId,
      });
      // --- Automação inteligente ---
      // Buscar campanhas ativas aguardando resposta desse lead
      const campanhasLeads = await CampaignLead.findAll({ where: { leadId: lead.id, status: 'aguardando_resposta' } });
      for (const cl of campanhasLeads) {
        // Buscar campanha e perfil de empresa
        const campanha = await Campaign.findByPk(cl.campaignId, { include: [Company] });
        if (!campanha || campanha.status === 'pausada' || campanha.status === 'encerrada') continue;
        const empresa = campanha?.Company;
        cl.resposta = msg.body;
        cl.ultima_interacao = new Date();
        // Detectar intenção (regex aprimorado)
        const texto = msg.body.toLowerCase();
        if (texto.match(/\b(n[aã]o|obrigado|n[ãa]o tenho interesse|sem interesse|agora n[ãa]o|desinteressado|talvez depois|não quero|pare|cancelar)\b/)) {
          // Resposta negativa
          cl.status = 'encerrado';
          await sendMessageSession(campanha.sessionId, lead.telefone + '@c.us', `Agradeço seu retorno, ${lead.nome}! Se mudar de ideia, estarei à disposição. Tenha um ótimo dia!`);
        } else if (texto.match(/\b(sim|quero|tenho interesse|vamos|pode ser|ok|agendar|marcar|topo|bora|interessado|gostei|vamos conversar)\b/)) {
          // Resposta positiva
          cl.status = 'agendado';
          await sendMessageSession(campanha.sessionId, lead.telefone + '@c.us', `Ótimo, ${lead.nome}! Vou agendar uma reunião rápida para conversarmos melhor. Qual o melhor dia e horário para você?`);
        } else {
          // Resposta neutra ou dúvida
          cl.status = 'aguardando_resposta';
          // Opcional: resposta humanizada para dúvidas
          if (texto.length < 100) {
            await sendMessageSession(campanha.sessionId, lead.telefone + '@c.us', `Se precisar de mais informações, ${lead.nome}, estou à disposição para esclarecer qualquer dúvida!`);
          }
        }
        await cl.save();
      }
      // --- Fim automação inteligente ---
    } catch (err) {
      console.error('Erro ao salvar mensagem recebida:', err);
    }
  });

  client.initialize();
  return sessions[sessionId];
}

export function listSessions() {
  return Object.entries(sessions).map(([id, s]) => ({
    id,
    status: s.status,
    qr: s.qr,
  }));
}

export function getSessionStatus(sessionId) {
  const s = sessions[sessionId];
  return s ? { status: s.status, qr: s.qr } : null;
}

export async function sendMessageSession(sessionId, jid, message) {
  const s = sessions[sessionId];
  if (!s || s.status !== 'conectado') throw new Error('Sessão não conectada');
  const sentMsg = await s.client.sendMessage(jid, message);
  try {
    const telefone = jid.replace(/@c\.us$/, '');
    const contact = await s.client.getContactById(jid);
    const nomeContato = contact.pushname || contact.name || telefone;
    let fotoContato = null;
    try {
      fotoContato = await contact.getProfilePicUrl();
    } catch {}
    let lead = await Lead.findOne({ where: { telefone } });
    if (!lead) {
      lead = await Lead.create({ nome: nomeContato, telefone, foto: fotoContato, whatsapp: true, ultimoContato: new Date() });
    } else {
      await lead.update({ nome: nomeContato, foto: fotoContato, ultimoContato: new Date() });
    }
    await Message.create({
      leadId: lead.id,
      conteudo: message,
      enviada: true,
      dataEnvio: new Date(),
      sessionId: sessionId,
    });
  } catch (err) {
    console.error('Erro ao salvar mensagem enviada:', err);
  }
  return sentMsg;
}

export function getStatus() {
  return isReady ? 'conectado' : 'desconectado';
}

export function getQRWeb() {
  return qrCode;
} 