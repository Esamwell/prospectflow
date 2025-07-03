import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Play, Pause, XCircle } from 'lucide-react';

const API_URL = 'http://localhost:4000/api/campaigns';

const Campaigns = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sessoes, setSessoes] = useState([]);
  const [editCampanha, setEditCampanha] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editSessionId, setEditSessionId] = useState('');
  const [editStatus, setEditStatus] = useState('ativa');
  const [editCompanyId, setEditCompanyId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [executandoId, setExecutandoId] = useState(null);
  const navigate = useNavigate();

  const carregarCampanhas = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.status === 401) {
          setErro('Sessão expirada. Faça login novamente.');
          setCampanhas([]);
          setLoading(false);
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCampanhas(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar campanhas');
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarCampanhas();
    // Buscar sessões ativas
    fetch('/api/whatsapp/sessions')
      .then(res => res.json())
      .then(data => setSessoes(data.filter(s => s.status === 'conectado')))
      .catch(() => setSessoes([]));
    // Buscar perfis de empresa
    fetch('/api/company')
      .then(res => res.json())
      .then(data => setEmpresas(Array.isArray(data) ? data : []))
      .catch(() => setEmpresas([]));
  }, []);

  const handleCriar = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!nome) {
      setErro('Preencha o nome da campanha');
      return;
    }
    if (!sessionId) {
      setErro('Selecione a sessão do WhatsApp');
      return;
    }
    if (!companyId) {
      setErro('Selecione o perfil de empresa');
      return;
    }
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ nome, descricao, sessionId, companyId })
    });
    if (res.ok) {
      setNome(''); setDescricao(''); setSessionId(''); setCompanyId('');
      setSucesso('Campanha criada com sucesso!');
      carregarCampanhas();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao criar campanha');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta campanha?')) return;
    setErro(''); setSucesso('');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    if (res.ok) {
      setSucesso('Campanha removida!');
      carregarCampanhas();
    } else {
      setErro('Erro ao remover campanha');
    }
  };

  const openEditModal = (campanha) => {
    setEditCampanha(campanha);
    setEditNome(campanha.nome);
    setEditDescricao(campanha.descricao || '');
    setEditSessionId(campanha.sessionId || '');
    setEditStatus(campanha.status || 'ativa');
    setEditCompanyId(campanha.companyId || '');
  };

  const closeEditModal = () => {
    setEditCampanha(null);
    setEditNome('');
    setEditDescricao('');
    setEditSessionId('');
    setEditStatus('ativa');
    setEditCompanyId('');
  };

  const handleEditSave = async () => {
    if (!editCampanha) return;
    setErro(''); setSucesso('');
    if (!editNome) {
      setErro('Preencha o nome da campanha');
      return;
    }
    if (!editSessionId) {
      setErro('Selecione a sessão do WhatsApp');
      return;
    }
    if (!editCompanyId) {
      setErro('Selecione o perfil de empresa');
      return;
    }
    const res = await fetch(`${API_URL}/${editCampanha.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ nome: editNome, descricao: editDescricao, sessionId: editSessionId, status: editStatus, companyId: editCompanyId })
    });
    if (res.ok) {
      closeEditModal();
      setSucesso('Campanha atualizada!');
      carregarCampanhas();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao atualizar campanha');
    }
  };

  const handleIniciarCampanha = async (id) => {
    setExecutandoId(id);
    setErro(''); setSucesso('');
    try {
      const res = await fetch(`/api/campaigns/${id}/start`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        setSucesso('Campanha iniciada! As mensagens estão sendo enviadas.');
      } else {
        const data = await res.json();
        setErro(data.error || 'Erro ao iniciar campanha');
      }
    } catch {
      setErro('Erro ao iniciar campanha');
    }
    setExecutandoId(null);
  };

  const handlePausarCampanha = async (id) => {
    setExecutandoId(id);
    setErro(''); setSucesso('');
    try {
      const res = await fetch(`/api/campaigns/${id}/pause`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        setSucesso('Campanha pausada!');
        carregarCampanhas();
      } else {
        const data = await res.json();
        setErro(data.error || 'Erro ao pausar campanha');
      }
    } catch {
      setErro('Erro ao pausar campanha');
    }
    setExecutandoId(null);
  };

  const handleEncerrarCampanha = async (id) => {
    setExecutandoId(id);
    setErro(''); setSucesso('');
    try {
      const res = await fetch(`/api/campaigns/${id}/close`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        setSucesso('Campanha encerrada!');
        carregarCampanhas();
      } else {
        const data = await res.json();
        setErro(data.error || 'Erro ao encerrar campanha');
      }
    } catch {
      setErro('Erro ao encerrar campanha');
    }
    setExecutandoId(null);
  };

  const safeCampanhas = Array.isArray(campanhas) ? campanhas : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Campanhas</h1>
        <p className="text-muted-foreground">Gerencie e acompanhe suas campanhas de prospecção aqui.</p>
      </div>
      <form onSubmit={handleCriar} className="flex flex-wrap gap-2 items-end">
        <Input placeholder="Nome da campanha" value={nome} onChange={e => setNome(e.target.value)} />
        <Input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <select className="border rounded p-2" value={sessionId} onChange={e => setSessionId(e.target.value)} required>
          <option value="">Selecione a sessão do WhatsApp</option>
          {sessoes.map(s => (
            <option key={s.id} value={s.id}>{s.id} ({s.status})</option>
          ))}
        </select>
        <select className="border rounded p-2" value={companyId} onChange={e => setCompanyId(e.target.value)} required>
          <option value="">Selecione o perfil de empresa</option>
          {empresas.map(e => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>
        <Button type="submit">Adicionar Campanha</Button>
      </form>
      {erro && <div className="text-destructive text-center">{erro}</div>}
      {sucesso && <div className="text-green-600 text-center">{sucesso}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Campanhas ({safeCampanhas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando campanhas...</div>
          ) : (
            <table className="min-w-full border text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Nome</th>
                  <th className="px-4 py-2 border-b">Descrição</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Sessão</th>
                  <th className="px-4 py-2 border-b">Perfil Empresa</th>
                  <th className="px-4 py-2 border-b">Ações</th>
                </tr>
              </thead>
              <tbody>
                {safeCampanhas.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2 border-b">{c.id}</td>
                    <td className="px-4 py-2 border-b">{c.nome}</td>
                    <td className="px-4 py-2 border-b">{c.descricao}</td>
                    <td className="px-4 py-2 border-b">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${c.status === 'ativa' ? 'bg-green-100 text-green-800' : c.status === 'pausada' ? 'bg-yellow-100 text-yellow-800' : c.status === 'encerrada' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-2 border-b">{c.sessionId || '-'}</td>
                    <td className="px-4 py-2 border-b">{(empresas.find(e => e.id === c.companyId)?.nome) || '-'}</td>
                    <td className="px-4 py-2 border-b">
                      <Button variant="secondary" size="sm" onClick={() => openEditModal(c)}>Editar</Button>{' '}
                      <Button variant="destructive" size="sm" onClick={() => handleExcluir(c.id)}>Excluir</Button>{' '}
                      {c.status === 'ativa' ? (
                        <Button variant="outline" size="sm" onClick={() => handleIniciarCampanha(c.id)} disabled={executandoId === c.id} title="Iniciar Campanha">
                          <Play className="w-4 h-4" />
                        </Button>
                      ) : c.status === 'pausada' ? (
                        <Button variant="outline" size="sm" onClick={() => handleIniciarCampanha(c.id)} disabled={executandoId === c.id} title="Retomar Campanha">
                          <Play className="w-4 h-4" />
                        </Button>
                      ) : null}
                      {c.status === 'ativa' && (
                        <Button variant="outline" size="sm" onClick={() => handlePausarCampanha(c.id)} disabled={executandoId === c.id} title="Pausar Campanha">
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      {c.status !== 'encerrada' && (
                        <Button variant="outline" size="sm" onClick={() => handleEncerrarCampanha(c.id)} disabled={executandoId === c.id} title="Encerrar Campanha">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {/* Modal de edição de campanha */}
      <Dialog open={!!editCampanha} onOpenChange={closeEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Campanha</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input placeholder="Nome da campanha" value={editNome} onChange={e => setEditNome(e.target.value)} />
            <Input placeholder="Descrição" value={editDescricao} onChange={e => setEditDescricao(e.target.value)} />
            <select className="border rounded p-2" value={editSessionId} onChange={e => setEditSessionId(e.target.value)} required>
              <option value="">Selecione a sessão do WhatsApp</option>
              {sessoes.map(s => (
                <option key={s.id} value={s.id}>{s.id} ({s.status})</option>
              ))}
            </select>
            <select className="border rounded p-2" value={editCompanyId} onChange={e => setEditCompanyId(e.target.value)} required>
              <option value="">Selecione o perfil de empresa</option>
              {empresas.map(e => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>
            <select className="border rounded p-2" value={editStatus} onChange={e => setEditStatus(e.target.value)} required>
              <option value="ativa">Ativa</option>
              <option value="inativa">Inativa</option>
            </select>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSave}>Salvar</Button>
            <Button variant="outline" onClick={closeEditModal}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaigns; 