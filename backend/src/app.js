import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import leadRoutes from './routes/leadRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import auth from './middleware/auth.js';
import campaignLeadRoutes from './routes/campaignLeadRoutes.js';
import scraperRoutes from './routes/scraperRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import companyRoutes from './routes/companyRoutes.js';

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const frontendUrl = process.env.FRONTEND_URL;

app.use(cors({
  origin: frontendUrl || true,
  credentials: true
}));
app.use(bodyParser.json());

// Rotas (exemplo)
app.get('/', (req, res) => {
  res.send('API ProspectFlow rodando!');
});

// Testar conexão com o banco
sequelize.authenticate()
  .then(() => console.log('Conectado ao PostgreSQL!'))
  .catch(err => console.error('Erro ao conectar ao PostgreSQL:', err));

app.use('/api/auth', authRoutes);
app.use('/api/leads', auth, leadRoutes);
app.use('/api/campaigns', auth, campaignRoutes);
app.use('/api/messages', auth, messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaign-leads', campaignLeadRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/company', companyRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro Interno do Servidor', details: err.message });
});

export default app; 