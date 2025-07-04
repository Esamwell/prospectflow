import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_SCRAPER = 'http://localhost:4000/api/scraper/google-maps';
const API_PROGRESSO = 'http://localhost:4000/api/scraper/google-maps/progresso';

const ScrapingLeads = () => {
  const [categoria, setCategoria] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [maxResults, setMaxResults] = useState(20);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (loading) {
      // Conectar ao SSE
      eventSourceRef.current = new window.EventSource(API_PROGRESSO);
      eventSourceRef.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          setProgress(data);
        } catch {}
      };
      eventSourceRef.current.onerror = () => {
        eventSourceRef.current?.close();
      };
    } else {
      setProgress({ current: 0, total: 0 });
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    }
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [loading]);

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
          {loading && (
            <div className="w-full flex flex-col items-center mb-4">
              <div className="w-full h-1 bg-gray-200 rounded overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full bg-blue-500 animate-progress-bar" style={{ width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '10%' }}></div>
              </div>
              <span className="text-sm text-muted-foreground mt-2">
                {progress.total > 0 ? `Abrindo cartão ${progress.current} de ${progress.total}` : 'Coletando leads, aguarde...'}
              </span>
            </div>
          )}
          {!loading && (
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