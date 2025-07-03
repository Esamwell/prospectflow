import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface Sessao {
  id: string;
  status: string;
}

interface Lead {
  id: number;
  nome: string;
  telefone: string;
  foto?: string;
  status: string;
}

interface Message {
  id: number;
  conteudo: string;
  enviada: boolean;
  dataEnvio: string;
}

const ConversasWhatsApp: React.FC = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSessoes();
  }, []);

  useEffect(() => {
    if (sessaoSelecionada) {
      fetchLeads(sessaoSelecionada);
      setSelectedLead(null);
      setMessages([]);
    }
  }, [sessaoSelecionada]);

  // Polling automático para atualizar mensagens
  useEffect(() => {
    if (selectedLead && sessaoSelecionada) {
      // Função para buscar mensagens
      const poll = async () => {
        try {
          const res = await axios.get(`/api/whatsapp/${sessaoSelecionada}/mensagens/${selectedLead.id}`);
          setMessages(res.data);
        } catch (err) {}
      };
      poll(); // Busca inicial
      pollingRef.current = setInterval(poll, 2000);
      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
      };
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  }, [selectedLead, sessaoSelecionada]);

  // Selecionar lead automaticamente se houver parâmetro na URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const leadTelefone = params.get('lead');
    const autoEnviar = params.get('enviar') === '1';
    if (leadTelefone && leads.length > 0) {
      const found = leads.find(l => l.telefone === leadTelefone);
      if (found) {
        fetchMessages(found);
        if (autoEnviar && inputRef.current) {
          setTimeout(() => inputRef.current?.focus(), 300);
        }
      }
    }
  }, [leads, location.search]);

  const fetchSessoes = async () => {
    const res = await axios.get('/api/whatsapp/sessions');
    setSessoes(res.data);
  };

  const fetchLeads = async (sessionId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/whatsapp/${sessionId}/conversas`);
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setLeads([]);
    }
    setLoading(false);
  };

  const fetchMessages = async (lead: Lead) => {
    setSelectedLead(lead);
    setLoading(true);
    try {
      const res = await axios.get(`/api/whatsapp/${sessaoSelecionada}/mensagens/${lead.id}`);
      setMessages(res.data);
    } catch (err) {
      setMessages([]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!selectedLead || !newMessage.trim() || !sessaoSelecionada) return;
    setLoading(true);
    try {
      await axios.post(`/api/whatsapp/session/${sessaoSelecionada}/send`, {
        jid: selectedLead.telefone + '@c.us',
        message: newMessage,
      });
      setNewMessage('');
      fetchMessages(selectedLead);
    } catch (err) {
      alert('Erro ao enviar mensagem');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
      {/* Seleção de sessão */}
      <div style={{ padding: 16, borderBottom: '1px solid #eee', background: '#fafafa', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span><b>Sessão:</b></span>
        <select value={sessaoSelecionada || ''} onChange={e => setSessaoSelecionada(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc' }}>
          <option value="">Selecione uma sessão</option>
          {sessoes.map(s => (
            <option key={s.id} value={s.id}>{s.id} ({s.status})</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Lista de conversas */}
        <div style={{ width: 300, borderRight: '1px solid #eee', overflowY: 'auto' }}>
          <h3 style={{ margin: 16 }}>Conversas</h3>
          {loading && leads.length === 0 && <div style={{ margin: 16 }}>Carregando...</div>}
          {leads.map(lead => (
            <div
              key={lead.id}
              style={{
                padding: 16,
                background: selectedLead?.id === lead.id ? '#f0f0f0' : 'white',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
              onClick={() => fetchMessages(lead)}
            >
              {lead.foto && (
                <img src={lead.foto} alt="foto" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc' }} />
              )}
              <div>
                <b>{lead.nome || lead.telefone}</b><br />
                <span style={{ color: '#888' }}>{lead.telefone}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Mensagens */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Topo do chat */}
          {selectedLead && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 0 16px', borderBottom: '1px solid #eee', background: '#fff' }}>
              {selectedLead.foto && (
                <img src={selectedLead.foto} alt="foto" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc' }} />
              )}
              <div style={{ flex: 1 }}>
                <b>{selectedLead.nome || selectedLead.telefone}</b><br />
                <span style={{ color: '#888' }}>{selectedLead.telefone}</span>
              </div>
              {/* Botões de classificação */}
              <div style={{ display: 'flex', gap: 8 }}>
                {['frio', 'morno', 'quente'].map((status) => (
                  <button
                    key={status}
                    onClick={async () => {
                      await axios.post(`/api/whatsapp/lead-status/${selectedLead.id}`, { status });
                      setSelectedLead({ ...selectedLead, status });
                      fetchLeads(sessaoSelecionada);
                    }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: selectedLead.status === status ? (status === 'frio' ? '#90caf9' : status === 'morno' ? '#ffe082' : '#ff8a65') : '#eee',
                      color: selectedLead.status === status ? '#222' : '#888',
                      fontWeight: selectedLead.status === status ? 'bold' : 'normal',
                      cursor: 'pointer',
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Área de mensagens com rolagem */}
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', background: '#fafafa', minHeight: 0 }}>
            {selectedLead ? (
              messages.length === 0 ? (
                <div>Nenhuma mensagem ainda.</div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} style={{
                    textAlign: msg.enviada ? 'right' : 'left',
                    margin: '8px 0',
                  }}>
                    <span style={{
                      display: 'inline-block',
                      background: msg.enviada ? '#d1ffd6' : '#fff',
                      padding: '8px 12px',
                      borderRadius: 16,
                      maxWidth: '70%',
                      wordBreak: 'break-word',
                    }}>
                      {msg.conteudo}
                    </span>
                    <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
                      {new Date(msg.dataEnvio).toLocaleString()}
                    </div>
                  </div>
                ))
              )
            ) : (
              <div>Selecione uma conversa para ver as mensagens.</div>
            )}
          </div>
          {/* Campo de envio fixo */}
          {selectedLead && (
            <div style={{ display: 'flex', padding: 16, borderTop: '1px solid #eee', background: '#fff', position: 'sticky', bottom: 0, zIndex: 2 }}>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Digite sua mensagem..."
                style={{ flex: 1, padding: 12, borderRadius: 16, border: '1px solid #ccc', marginRight: 8 }}
                ref={inputRef}
              />
              <button
                onClick={handleSend}
                style={{ padding: '12px 24px', borderRadius: 16, border: 'none', background: '#4caf50', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Enviar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversasWhatsApp; 