import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const API_CAMPAIGNS = 'http://localhost:4000/api/campaigns';
const API_LEADS = 'http://localhost:4000/api/leads';
const API_CAMPAIGN_LEADS = 'http://localhost:4000/api/campaign-leads';

const LeadsCampanha = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [campanhaId, setCampanhaId] = useState('');
  const [leadsCampanha, setLeadsCampanha] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_CAMPAIGNS, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.status === 401) {
          setErro('Sessão expirada. Faça login novamente.');
          setCampanhas([]);
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => { if (data) setCampanhas(Array.isArray(data) ? data : []); });
    fetch(API_LEADS, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.status === 401) {
          setErro('Sessão expirada. Faça login novamente.');
          setLeads([]);
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => { if (data) setLeads(Array.isArray(data) ? data : []); });
  }, []);

  useEffect(() => {
    if (campanhaId) {
      setLoading(true);
      fetch(`${API_CAMPAIGN_LEADS}/${campanhaId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(res => {
          if (res.status === 401) {
            setErro('Sessão expirada. Faça login novamente.');
            setLeadsCampanha([]);
            setLoading(false);
            navigate('/login');
            return null;
          }
          return res.json();
        })
        .then(data => { if (data) { setLeadsCampanha(Array.isArray(data) ? data : []); setLoading(false); } });
    } else {
      setLeadsCampanha([]);
    }
  }, [campanhaId]);

  const handleAdicionar = async (leadId) => {
    setErro(''); setSucesso('');
    const res = await fetch(API_CAMPAIGN_LEADS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: campanhaId, leadId })
    });
    if (res.ok) {
      setSucesso('Lead adicionado!');
      fetch(`${API_CAMPAIGN_LEADS}/${campanhaId}`).then(res => res.json()).then(setLeadsCampanha);
    } else {
      setErro('Erro ao adicionar lead');
    }
  };

  const handleRemover = async (campaignLeadId) => {
    setErro(''); setSucesso('');
    const res = await fetch(`${API_CAMPAIGN_LEADS}/${campaignLeadId}`, { method: 'DELETE' });
    if (res.ok) {
      setSucesso('Lead removido!');
      fetch(`${API_CAMPAIGN_LEADS}/${campanhaId}`).then(res => res.json()).then(setLeadsCampanha);
    } else {
      setErro('Erro ao remover lead');
    }
  };

  // Garantir que leads e leadsCampanha são arrays
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeLeadsCampanha = Array.isArray(leadsCampanha) ? leadsCampanha : [];
  // Leads disponíveis para adicionar (não vinculados)
  const leadsDisponiveis = safeLeads.filter(l => !safeLeadsCampanha.some(lc => lc.id === l.id || lc.leadId === l.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leads por Campanha</h1>
        <p className="text-muted-foreground">Gerencie os leads vinculados a cada campanha.</p>
      </div>
      <div className="flex gap-2 items-center">
        <span>Campanha:</span>
        <select value={campanhaId} onChange={e => setCampanhaId(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Selecione</option>
          {campanhas.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>
      {campanhaId && (
        <>
          {erro && <div className="text-destructive text-center">{erro}</div>}
          {sucesso && <div className="text-green-600 text-center">{sucesso}</div>}
          <Card>
            <CardHeader>
              <CardTitle>Leads vinculados ({leadsCampanha.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">Carregando leads...</div>
              ) : (
                <table className="min-w-full border text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">Nome</th>
                      <th className="px-4 py-2 border-b">Telefone</th>
                      <th className="px-4 py-2 border-b">Cidade</th>
                      <th className="px-4 py-2 border-b">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeLeadsCampanha.map((l) => (
                      <tr key={l.campaignLeadId}>
                        <td className="px-4 py-2 border-b">{l.nome}</td>
                        <td className="px-4 py-2 border-b">{l.telefone}</td>
                        <td className="px-4 py-2 border-b">{l.cidade}</td>
                        <td className="px-4 py-2 border-b">
                          <Button variant="destructive" size="sm" onClick={() => handleRemover(l.campaignLeadId)}>Remover</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Leads disponíveis para adicionar</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="min-w-full border text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Nome</th>
                    <th className="px-4 py-2 border-b">Telefone</th>
                    <th className="px-4 py-2 border-b">Cidade</th>
                    <th className="px-4 py-2 border-b">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsDisponiveis.map((l) => (
                    <tr key={l.id}>
                      <td className="px-4 py-2 border-b">{l.nome}</td>
                      <td className="px-4 py-2 border-b">{l.telefone}</td>
                      <td className="px-4 py-2 border-b">{l.cidade}</td>
                      <td className="px-4 py-2 border-b">
                        <Button size="sm" onClick={() => handleAdicionar(l.id)}>Adicionar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default LeadsCampanha; 