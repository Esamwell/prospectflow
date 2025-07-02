import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Lead = sequelize.define('Lead', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  telefone: { type: DataTypes.STRING, allowNull: false },
  whatsapp: { type: DataTypes.BOOLEAN, defaultValue: false },
  endereco: { type: DataTypes.STRING },
  cidade: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING },
  categoria: { type: DataTypes.STRING },
  site: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'pendente' },
}, {
  tableName: 'leads',
  timestamps: true,
});

export default Lead; 