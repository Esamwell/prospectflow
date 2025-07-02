import sequelize from './config/database.js';
import './models/index.js';

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Tabelas sincronizadas com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao sincronizar tabelas:', err);
    process.exit(1);
  }
})(); 