import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CampaignLead = sequelize.define('CampaignLead', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  campaignId: { type: DataTypes.INTEGER, allowNull: false },
  leadId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'novo' },
  ultima_interacao: { type: DataTypes.DATE },
  tentativas: { type: DataTypes.INTEGER, defaultValue: 0 },
  resposta: { type: DataTypes.TEXT },
}, {
  tableName: 'campaign_leads',
  timestamps: true,
});

export default CampaignLead; 