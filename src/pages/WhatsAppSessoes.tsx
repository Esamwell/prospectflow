import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_MULTI = 'http://localhost:4000/api/whatsapp-multi';

const WhatsAppSessoes = () => {
  const [sessoes, setSessoes] = useState([]);
  const [novaSessao, setNovaSessao] = useState('');
  const [qrCodes, setQrCodes] = useState({});
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const carregarSessoes = () => {
    fetch(`${API_MULTI}/list`)
      .then(res => res.json())
      .then(data => setSessoes(data));
  };

  useEffect(() => {
    carregarSessoes();
    const interval = setInterval(carregarSessoes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCriar = async (e) => {
    e.preventDefault();
    setErro('');
    if (!novaSessao) return setErro('Informe um nome para a sessão');
    setLoading(true);
    await fetch(`${API_MULTI}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: novaSessao })
    });
    setNovaSessao('');
    setLoading(false);
    carregarSessoes();
  };

  const handleRemover = async (id) => {
    await fetch(`${API_MULTI}/${id}`, { method: 'DELETE' });
    carregarSessoes();
  };

  const fetchQr = async (id) => {
    const res = await fetch(`${API_MULTI}/${id}/qr`);
    if (res.ok) {
      const data = await res.json();
      setQrCodes(qr => ({ ...qr, [id]: data.qr }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sessões WhatsApp</h1>
        <p className="text-muted-foreground">Gerencie múltiplos números de WhatsApp conectados ao sistema.</p>
      </div>
      <form onSubmit={handleCriar} className="flex flex-wrap gap-2 items-end">
        <Input placeholder="Nome da sessão (ex: comercial01)" value={novaSessao} onChange={e => setNovaSessao(e.target.value)} />
        <Button type="submit" disabled={loading}>Criar Nova Sessão</Button>
      </form>
      {erro && <div className="text-destructive text-center">{erro}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Sessões Ativas ({sessoes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full border text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">QR Code</th>
                <th className="px-4 py-2 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sessoes.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2 border-b">{s.id}</td>
                  <td className="px-4 py-2 border-b">
                    {s.connected ? <span className="text-green-600">Conectado</span> : <span className="text-yellow-600">Aguardando conexão</span>}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {!s.connected && (
                      qrCodes[s.id] ? (
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodes[s.id])}&size=120x120`} alt="QR Code" />
                      ) : (
                        <Button size="sm" onClick={() => fetchQr(s.id)}>Exibir QR</Button>
                      )
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <Button variant="destructive" size="sm" onClick={() => handleRemover(s.id)}>Remover</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppSessoes; 