import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Campaign = sequelize.define('Campaign', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'ativa' },
  sessionId: { type: DataTypes.STRING },
  companyId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'company', key: 'id' } },
}, {
  tableName: 'campaigns',
  timestamps: true,
});

export default Campaign; 