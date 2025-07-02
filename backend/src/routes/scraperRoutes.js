import express from 'express';
import { scrapeGoogleMaps } from '../services/scraperService.js';
import { Lead } from '../models/index.js';
const router = express.Router();

router.post('/google-maps', async (req, res) => {
  const { categoria, cidade, estado, maxResults } = req.body;
  if (!categoria || !cidade || !estado) return res.status(400).json({ error: 'Parâmetros obrigatórios' });
  try {
    const results = await scrapeGoogleMaps({ categoria, cidade, estado, maxResults });
    console.log('Resultados brutos do scraping:', results);
    // Logar cada resultado individualmente
    results.forEach((r, idx) => {
      console.log(`Lead #${idx + 1}:`, r);
    });
    // Salvar leads no banco
    const leads = [];
    for (const r of results) {
      if (!r.nome || !r.telefone) {
        console.log('Lead ignorado (faltando nome ou telefone):', r);
        continue;
      }
      try {
        console.log('Salvando lead:', r);
        const lead = await Lead.create({
          nome: r.nome,
          telefone: r.telefone,
          endereco: r.endereco,
          cidade,
          estado,
          site: r.site,
          categoria
        });
        leads.push(lead);
        console.log('Lead salvo com sucesso:', lead.toJSON());
      } catch (err) {
        console.error('Erro ao salvar lead:', r, err);
      }
    }
    res.json({ leads });
  } catch (err) {
    console.error('Erro no endpoint de scraping:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router; 