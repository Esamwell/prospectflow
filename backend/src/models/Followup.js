import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Followup = sequelize.define('Followup', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  campaignId: { type: DataTypes.INTEGER, allowNull: false },
  ordem: { type: DataTypes.INTEGER, allowNull: false },
  conteudo: { type: DataTypes.TEXT, allowNull: false },
  delayDias: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, {
  tableName: 'followups',
  timestamps: true,
});

export default Followup; 