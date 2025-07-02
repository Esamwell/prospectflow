import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/api/messages';

const Mensagens = () => {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [leadId, setLeadId] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const carregarMensagens = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.status === 401) {
          setErro('Sessão expirada. Faça login novamente.');
          setMensagens([]);
          setLoading(false);
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setMensagens(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar mensagens');
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarMensagens();
  }, []);

  const handleEnviar = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!leadId || !conteudo) {
      setErro('Preencha o ID do lead e a mensagem');
      return;
    }
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, conteudo })
    });
    if (res.ok) {
      setLeadId(''); setConteudo('');
      setSucesso('Mensagem enviada!');
      carregarMensagens();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao enviar mensagem');
    }
  };

  const safeMensagens = Array.isArray(mensagens) ? mensagens : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mensagens</h1>
        <p className="text-muted-foreground">Visualize e envie mensagens para seus leads.</p>
      </div>
      <form onSubmit={handleEnviar} className="flex flex-wrap gap-2 items-end">
        <Input placeholder="ID do Lead" value={leadId} onChange={e => setLeadId(e.target.value)} />
        <Input placeholder="Mensagem" value={conteudo} onChange={e => setConteudo(e.target.value)} />
        <Button type="submit">Enviar Mensagem</Button>
      </form>
      {erro && <div className="text-destructive text-center">{erro}</div>}
      {sucesso && <div className="text-green-600 text-center">{sucesso}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Mensagens ({safeMensagens.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando mensagens...</div>
          ) : (
            <table className="min-w-full border text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Lead</th>
                  <th className="px-4 py-2 border-b">Conteúdo</th>
                  <th className="px-4 py-2 border-b">Enviada</th>
                  <th className="px-4 py-2 border-b">Resposta</th>
                  <th className="px-4 py-2 border-b">Data</th>
                </tr>
              </thead>
              <tbody>
                {safeMensagens.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-2 border-b">{m.id}</td>
                    <td className="px-4 py-2 border-b">{m.leadId}</td>
                    <td className="px-4 py-2 border-b">{m.conteudo}</td>
                    <td className="px-4 py-2 border-b">{m.enviada ? 'Sim' : 'Não'}</td>
                    <td className="px-4 py-2 border-b">{m.resposta || '-'}</td>
                    <td className="px-4 py-2 border-b">{m.dataEnvio ? new Date(m.dataEnvio).toLocaleString('pt-BR') : '-'}</td>
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

export default Mensagens; 