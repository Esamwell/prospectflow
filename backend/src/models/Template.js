import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Template = sequelize.define('Template', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'templates',
  timestamps: true
});

export default Template;
