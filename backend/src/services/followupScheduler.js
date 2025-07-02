import { Followup, Campaign, Lead, Message, CampaignLead } from '../models/index.js';
import { sendMessageJid } from './whatsappService.js';
import sequelize from '../config/database.js';

// Função para buscar e enviar follow-ups pendentes
async function processarFollowups() {
  // Buscar todas as campanhas
  const campanhas = await Campaign.findAll();
  for (const campanha of campanhas) {
    // Buscar etapas de follow-up ordenadas
    const etapas = await Followup.findAll({ where: { campaignId: campanha.id }, order: [['ordem', 'ASC']] });
    if (!etapas.length) continue;
    // Buscar leads vinculados à campanha
    const campaignLeads = await CampaignLead.findAll({ where: { campaignId: campanha.id } });
    const leads = await Lead.findAll({ where: { id: campaignLeads.map(cl => cl.leadId) } });
    for (const lead of leads) {
      // Verificar se o lead já respondeu (simulado: status respondido)
      if (lead.status === 'respondido') continue;
      // Buscar mensagens já enviadas para este lead nesta campanha
      const msgs = await Message.findAll({ where: { leadId: lead.id, campaignId: campanha.id } });
      // Descobrir próxima etapa
      const etapaIndex = msgs.length;
      if (etapaIndex >= etapas.length) continue; // Todas etapas já enviadas
      const etapa = etapas[etapaIndex];
      // Calcular se já passou o delay
      let podeEnviar = false;
      if (etapaIndex === 0) {
        podeEnviar = true; // Primeira mensagem
      } else if (msgs.length) {
        const ultimaMsg = msgs[msgs.length - 1];
        const ultimaData = ultimaMsg.dataEnvio || ultimaMsg.createdAt;
        const proximaData = new Date(ultimaData);
        proximaData.setDate(proximaData.getDate() + etapa.delayDias);
        if (new Date() >= proximaData) podeEnviar = true;
      }
      if (podeEnviar) {
        // Enviar mensagem via WhatsApp
        try {
          await sendMessageJid(lead.telefone + '@s.whatsapp.net', etapa.conteudo);
          // Registrar mensagem no banco
          await Message.create({
            leadId: lead.id,
            campaignId: campanha.id,
            conteudo: etapa.conteudo,
            enviada: true,
            dataEnvio: new Date()
          });
          console.log(`Follow-up enviado para lead ${lead.nome} (${lead.telefone}) na campanha ${campanha.nome}`);
        } catch (err) {
          console.error('Erro ao enviar follow-up:', err.message);
        }
      }
    }
  }
}

// Agendar execução a cada minuto
setInterval(processarFollowups, 60 * 1000);

export default processarFollowups; 