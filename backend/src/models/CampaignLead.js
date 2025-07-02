import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CampaignLead = sequelize.define('CampaignLead', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  campaignId: { type: DataTypes.INTEGER, allowNull: false },
  leadId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'campaign_leads',
  timestamps: true,
});

export default CampaignLead; 