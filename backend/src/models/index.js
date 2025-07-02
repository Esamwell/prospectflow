import Lead from './Lead.js';
import Campaign from './Campaign.js';
import Message from './Message.js';
import User from './User.js';
import Followup from './Followup.js';
import CampaignLead from './CampaignLead.js';

// Associações
Lead.hasMany(Message, { foreignKey: 'leadId' });
Message.belongsTo(Lead, { foreignKey: 'leadId' });

Campaign.hasMany(Message, { foreignKey: 'campaignId' });
Message.belongsTo(Campaign, { foreignKey: 'campaignId' });

Campaign.hasMany(Followup, { foreignKey: 'campaignId' });
Followup.belongsTo(Campaign, { foreignKey: 'campaignId' });

Campaign.belongsToMany(Lead, { through: CampaignLead, foreignKey: 'campaignId', otherKey: 'leadId' });
Lead.belongsToMany(Campaign, { through: CampaignLead, foreignKey: 'leadId', otherKey: 'campaignId' });

// Associações para CampaignLead
CampaignLead.belongsTo(Lead, { foreignKey: 'leadId' });
CampaignLead.belongsTo(Campaign, { foreignKey: 'campaignId' });
Lead.hasMany(CampaignLead, { foreignKey: 'leadId' });
Campaign.hasMany(CampaignLead, { foreignKey: 'campaignId' });

export { Lead, Campaign, Message, User, Followup, CampaignLead }; 