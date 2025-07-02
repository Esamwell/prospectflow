import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_SCRAPER = 'http://localhost:4000/api/scraper/google-maps';

const ScrapingLeads = () => {
  const [categoria, setCategoria] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [maxResults, setMaxResults] = useState(20);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleScraping = async (e) => {
    e.preventDefault();
    setErro('');
    setLeads([]);
    setLoading(true);
    const res = await fetch(API_SCRAPER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria, cidade, estado, maxResults })
    });
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads);
    } else {
      setErro('Erro ao coletar leads');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Scraping de Leads</h1>
        <p className="text-muted-foreground">Colete leads automaticamente do Google Meu Negócio (Google Maps).</p>
      </div>
      <form onSubmit={handleScraping} className="flex flex-wrap gap-2 items-end">
        <Input placeholder="Categoria (ex: Restaurante)" value={categoria} onChange={e => setCategoria(e.target.value)} />
        <Input placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} />
        <Input placeholder="Estado (sigla)" value={estado} onChange={e => setEstado(e.target.value)} style={{width: 100}} />
        <Input placeholder="Máx. resultados" type="number" value={maxResults} onChange={e => setMaxResults(Number(e.target.value))} style={{width: 120}} />
        <Button type="submit">Coletar Leads</Button>
      </form>
      {erro && <div className="text-destructive text-center">{erro}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Leads Coletados ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Coletando leads, aguarde...</div>
          ) : (
            <table className="min-w-full border text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Nome</th>
                  <th className="px-4 py-2 border-b">Telefone</th>
                  <th className="px-4 py-2 border-b">Endereço</th>
                  <th className="px-4 py-2 border-b">Site</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 border-b">{l.nome}</td>
                    <td className="px-4 py-2 border-b">{l.telefone}</td>
                    <td className="px-4 py-2 border-b">{l.endereco}</td>
                    <td className="px-4 py-2 border-b">{l.site}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingLeads; 