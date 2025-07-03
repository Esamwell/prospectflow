import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Sessao {
  id: string;
  status: string;
  qr: string | null;
}

const WhatsAppSessoes: React.FC = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [novaSessao, setNovaSessao] = useState('');
  const [jid, setJid] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [qrAtual, setQrAtual] = useState<string | null>(null);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<string | null>(null);

  useEffect(() => {
    fetchSessoes();
    const interval = setInterval(fetchSessoes, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessoes = async () => {
    const res = await axios.get('/api/whatsapp/sessions');
    setSessoes(res.data);
  };

  const criarSessao = async () => {
    if (!novaSessao.trim()) return;
    await axios.post('/api/whatsapp/session', { id: novaSessao.trim() });
    setNovaSessao('');
    fetchSessoes();
  };

  const mostrarQr = async (id: string) => {
    setSessaoSelecionada(id);
    const res = await axios.get(`/api/whatsapp/session/${id}`);
    setQrAtual(res.data.qr || null);
  };

  const enviarMensagem = async () => {
    if (!sessaoSelecionada || !jid.trim() || !mensagem.trim()) return;
    setEnviando(true);
    try {
      await axios.post(`/api/whatsapp/session/${sessaoSelecionada}/send`, { jid, message: mensagem });
      setMensagem('');
    } catch (err) {
      alert('Erro ao enviar mensagem');
    }
    setEnviando(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h2>Sessões WhatsApp</h2>
      <div style={{ margin: '16px 0', display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Nome da sessão (ex: comercial01)"
          value={novaSessao}
          onChange={e => setNovaSessao(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc', flex: 1 }}
        />
        <button onClick={criarSessao} style={{ padding: '8px 16px', borderRadius: 8, background: '#1976d2', color: 'white', border: 'none' }}>
          Criar Nova Sessão
        </button>
      </div>
      <h3>Sessões Ativas ({sessoes.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 8, border: '1px solid #eee' }}>ID</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Status</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>QR Code</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sessoes.map(sessao => (
            <tr key={sessao.id}>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{sessao.id}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{sessao.status}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>
                {sessao.qr ? (
                  <button onClick={() => mostrarQr(sessao.id)} style={{ padding: '4px 12px', borderRadius: 8, background: '#ffb300', color: '#222', border: 'none' }}>
                    Ver QR
                  </button>
                ) : '—'}
              </td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>
                <button onClick={() => setSessaoSelecionada(sessao.id)} style={{ padding: '4px 12px', borderRadius: 8, background: '#4caf50', color: 'white', border: 'none' }}>
                  Selecionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal QR Code */}
      {qrAtual && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setQrAtual(null)}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16 }} onClick={e => e.stopPropagation()}>
            <h4>Escaneie o QR Code</h4>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrAtual)}&size=200x200`} alt="QR Code" />
            <div style={{ marginTop: 16, color: '#888' }}>Clique fora para fechar</div>
          </div>
        </div>
      )}
      {/* Envio de mensagem por sessão */}
      {sessaoSelecionada && (
        <div style={{ marginTop: 32, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
          <h4>Enviar mensagem pela sessão <b>{sessaoSelecionada}</b></h4>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              type="text"
              placeholder="jid (ex: 5511999999999@c.us)"
              value={jid}
              onChange={e => setJid(e.target.value)}
              style={{ flex: 2, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="Mensagem"
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              style={{ flex: 3, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            />
            <button onClick={enviarMensagem} disabled={enviando} style={{ padding: '8px 16px', borderRadius: 8, background: '#1976d2', color: 'white', border: 'none' }}>
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSessoes; 