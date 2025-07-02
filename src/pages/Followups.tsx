import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_CAMPAIGNS = 'http://localhost:4000/api/campaigns';
const API_FOLLOWUPS = 'http://localhost:4000/api/followups';

const Followups = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [campanhaId, setCampanhaId] = useState('');
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [ordem, setOrdem] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [delayDias, setDelayDias] = useState('');
  const [editando, setEditando] = useState(null);
  const [editOrdem, setEditOrdem] = useState('');
  const [editConteudo, setEditConteudo] = useState('');
  const [editDelayDias, setEditDelayDias] = useState('');

  useEffect(() => {
    fetch(API_CAMPAIGNS)
      .then(res => res.json())
      .then(data => setCampanhas(data));
  }, []);

  useEffect(() => {
    if (campanhaId) {
      setLoading(true);
      fetch(`${API_FOLLOWUPS}/campaign/${campanhaId}`)
        .then(res => res.json())
        .then(data => { setFollowups(data); setLoading(false); })
        .catch(() => { setErro('Erro ao carregar follow-ups'); setLoading(false); });
    } else {
      setFollowups([]);
    }
  }, [campanhaId]);

  const handleCriar = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!ordem || !conteudo || !delayDias || !campanhaId) {
      setErro('Preencha todos os campos');
      return;
    }
    const res = await fetch(API_FOLLOWUPS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ordem, conteudo, delayDias, campaignId: campanhaId })
    });
    if (res.ok) {
      setOrdem(''); setConteudo(''); setDelayDias('');
      setSucesso('Etapa criada!');
      fetch(`${API_FOLLOWUPS}/campaign/${campanhaId}`).then(res => res.json()).then(setFollowups);
    } else {
      setErro('Erro ao criar etapa');
    }
  };

  const handleEditar = (f) => {
    setEditando(f.id);
    setEditOrdem(f.ordem);
    setEditConteudo(f.conteudo);
    setEditDelayDias(f.delayDias);
  };

  const handleSalvarEdicao = async (id) => {
    setErro(''); setSucesso('');
    const res = await fetch(`${API_FOLLOWUPS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ordem: editOrdem, conteudo: editConteudo, delayDias: editDelayDias })
    });
    if (res.ok) {
      setEditando(null);
      setSucesso('Etapa atualizada!');
      fetch(`${API_FOLLOWUPS}/campaign/${campanhaId}`).then(res => res.json()).then(setFollowups);
    } else {
      setErro('Erro ao editar etapa');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Excluir esta etapa?')) return;
    setErro(''); setSucesso('');
    const res = await fetch(`${API_FOLLOWUPS}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSucesso('Etapa removida!');
      fetch(`${API_FOLLOWUPS}/campaign/${campanhaId}`).then(res => res.json()).then(setFollowups);
    } else {
      setErro('Erro ao remover etapa');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Follow-up Automático</h1>
        <p className="text-muted-foreground">Configure as etapas de mensagens automáticas para cada campanha.</p>
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
          <form onSubmit={handleCriar} className="flex flex-wrap gap-2 items-end">
            <Input placeholder="Ordem" type="number" value={ordem} onChange={e => setOrdem(e.target.value)} style={{width: 80}} />
            <Input placeholder="Mensagem" value={conteudo} onChange={e => setConteudo(e.target.value)} style={{width: 300}} />
            <Input placeholder="Delay (dias)" type="number" value={delayDias} onChange={e => setDelayDias(e.target.value)} style={{width: 120}} />
            <Button type="submit">Adicionar Etapa</Button>
          </form>
          {erro && <div className="text-destructive text-center">{erro}</div>}
          {sucesso && <div className="text-green-600 text-center">{sucesso}</div>}
          <Card>
            <CardHeader>
              <CardTitle>Etapas ({followups.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground">Carregando etapas...</div>
              ) : (
                <table className="min-w-full border text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">Ordem</th>
                      <th className="px-4 py-2 border-b">Mensagem</th>
                      <th className="px-4 py-2 border-b">Delay (dias)</th>
                      <th className="px-4 py-2 border-b">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {followups.map((f) => (
                      <tr key={f.id}>
                        <td className="px-4 py-2 border-b">
                          {editando === f.id ? (
                            <Input type="number" value={editOrdem} onChange={e => setEditOrdem(e.target.value)} style={{width: 80}} />
                          ) : f.ordem}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {editando === f.id ? (
                            <Input value={editConteudo} onChange={e => setEditConteudo(e.target.value)} style={{width: 300}} />
                          ) : f.conteudo}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {editando === f.id ? (
                            <Input type="number" value={editDelayDias} onChange={e => setEditDelayDias(e.target.value)} style={{width: 120}} />
                          ) : f.delayDias}
                        </td>
                        <td className="px-4 py-2 border-b flex gap-2">
                          {editando === f.id ? (
                            <>
                              <Button onClick={() => handleSalvarEdicao(f.id)} size="sm" className="bg-green-600 text-white">Salvar</Button>
                              <Button onClick={() => setEditando(null)} size="sm" className="bg-gray-400 text-white">Cancelar</Button>
                            </>
                          ) : (
                            <>
                              <Button onClick={() => handleEditar(f)} size="sm" className="bg-blue-600 text-white">Editar</Button>
                              <Button onClick={() => handleExcluir(f.id)} size="sm" variant="destructive">Excluir</Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Followups; 