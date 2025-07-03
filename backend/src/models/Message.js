import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  leadId: { type: DataTypes.INTEGER, allowNull: false },
  campaignId: { type: DataTypes.INTEGER },
  conteudo: { type: DataTypes.TEXT, allowNull: false },
  enviada: { type: DataTypes.BOOLEAN, defaultValue: false },
  resposta: { type: DataTypes.TEXT },
  dataEnvio: { type: DataTypes.DATE },
  sessionId: { type: DataTypes.STRING },
}, {
  tableName: 'messages',
  timestamps: true,
});

export default Message; 