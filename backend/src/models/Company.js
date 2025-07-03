import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Company = sequelize.define('Company', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT },
  area_atuacao: { type: DataTypes.STRING },
  produtos_servicos: { type: DataTypes.TEXT },
  diferenciais: { type: DataTypes.TEXT },
  tom_voz: { type: DataTypes.STRING },
  representante: { type: DataTypes.STRING },
}, {
  tableName: 'company',
  timestamps: true,
});

export default Company; 