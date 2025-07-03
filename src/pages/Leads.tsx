import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Users, 
  MessageSquare, 
  Check,
  Clock,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { saveAs } from 'file-saver';

const API_URL = 'http://localhost:4000/api/leads';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [editLead, setEditLead] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editCidade, setEditCidade] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [sendLead, setSendLead] = useState(null);
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sessoes, setSessoes] = useState([]);
  const [sessaoSelecionada, setSessaoSelecionada] = useState('');
  const navigate = useNavigate();

  const carregarLeads = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.status === 401) {
          setErro('Sessão expirada. Faça login novamente.');
          setLeads([]);
          setLoading(false);
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setLeads(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar leads');
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarLeads();
  }, []);

  const handleCriar = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!nome || !telefone || !cidade) {
      setErro('Preencha nome, telefone e cidade');
      return;
    }
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ nome, telefone, cidade, categoria })
    });
    if (res.ok) {
      setNome(''); setTelefone(''); setCidade(''); setCategoria('');
      setSucesso('Lead criado com sucesso!');
      carregarLeads();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao criar lead');
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este lead?')) return;
    setErro(''); setSucesso('');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    if (res.ok) {
      setSucesso('Lead removido!');
      carregarLeads();
    } else {
      setErro('Erro ao remover lead');
    }
  };

  const openEditModal = (lead) => {
    setEditLead(lead);
    setEditNome(lead.nome);
    setEditTelefone(lead.telefone);
    setEditCidade(lead.cidade || '');
    setEditCategoria(lead.categoria || '');
  };

  const closeEditModal = () => {
    setEditLead(null);
    setEditNome('');
    setEditTelefone('');
    setEditCidade('');
    setEditCategoria('');
  };

  const handleEditSave = async () => {
    if (!editLead) return;
    setErro(''); setSucesso('');
    try {
      const res = await fetch(`${API_URL}/${editLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ nome: editNome, telefone: editTelefone, cidade: editCidade, categoria: editCategoria })
      });
      if (res.ok) {
        setSucesso('Lead atualizado com sucesso!');
        closeEditModal();
        carregarLeads();
      } else {
        const data = await res.json();
        setErro(data.error || 'Erro ao atualizar lead');
      }
    } catch (err) {
      setErro('Erro ao atualizar lead');
    }
  };

  const openSendModal = async (lead) => {
    setSendLead(lead);
    setSendMessage('');
    setSessaoSelecionada('');
    // Buscar sessões ativas
    try {
      const res = await fetch('/api/whatsapp/sessions');
      const data = await res.json();
      setSessoes(data.filter(s => s.status === 'conectado'));
    } catch {
      setSessoes([]);
    }
  };

  const closeSendModal = () => {
    setSendLead(null);
    setSendMessage('');
    setSending(false);
  };

  const handleSendMessage = async () => {
    if (!sendLead || !sendMessage.trim() || !sessaoSelecionada) return;
    setSending(true);
    try {
      await fetch(`/api/whatsapp/session/${sessaoSelecionada}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ jid: sendLead.telefone + '@c.us', message: sendMessage })
      });
      closeSendModal();
      carregarLeads();
    } catch (err) {
      setSending(false);
      alert('Erro ao enviar mensagem');
    }
  };

  const safeLeads = Array.isArray(leads) ? leads : [];
  const filteredLeads = safeLeads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.telefone.includes(searchTerm) ||
                         (lead.cidade && lead.cidade.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Cálculo de estatísticas
  const totalLeads = safeLeads.length;
  const leadsQuentes = safeLeads.filter(l => l.status === 'quente').length;
  const leadsResponderam = safeLeads.filter(l => (l.respostas || 0) > 0).length;
  const leadsPendentes = safeLeads.filter(l => l.status === 'pendente').length;
  const taxaResposta = totalLeads > 0 ? (leadsResponderam / totalLeads) * 100 : 0;

  const stats = [
    { label: 'Total de Leads', value: totalLeads, icon: Users },
    { label: 'Leads Quentes', value: leadsQuentes, icon: Users },
    { label: 'Responderam', value: leadsResponderam, icon: Check },
    { label: 'Pendentes', value: leadsPendentes, icon: Clock }
  ];

  const getStatusBadge = (status) => {
    const configs = {
      'quente': { variant: 'default', color: 'bg-red-500', dot: 'bg-red-600', label: 'Quente' },
      'morno': { variant: 'default', color: 'bg-yellow-200', dot: 'bg-yellow-500', label: 'Morno' },
      'frio': { variant: 'default', color: 'bg-blue-200', dot: 'bg-blue-500', label: 'Frio' },
      'respondido': { variant: 'default', color: 'bg-green-500', dot: 'bg-green-600', label: 'Respondeu' },
      'enviado': { variant: 'secondary', color: 'bg-blue-500', dot: 'bg-blue-600', label: 'Enviado' },
      'ignorado': { variant: 'secondary', color: 'bg-gray-500', dot: 'bg-gray-600', label: 'Ignorado' },
      'pendente': { variant: 'outline', color: 'bg-yellow-500', dot: 'bg-yellow-600', label: 'Pendente' }
    };
    const config = configs[status] || { variant: 'outline', color: '', dot: '', label: status };
    return (
      <Badge variant={config.variant} className={`gap-1 ${config.color}`.trim()} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <span className={`w-2 h-2 rounded-full ${config.dot} mr-1`} />
        {config.label}
      </Badge>
    );
  };

  // Função para exportar leads em CSV
  const exportarLeadsCSV = () => {
    const csvHeader = 'Nome;Telefone;Cidade;Categoria;Status;Último Contato;Respostas\r\n';
    const csvRows = filteredLeads.map(lead => [
      (lead.nome || '').replace(/;/g, ','),
      (lead.telefone || '').replace(/;/g, ','),
      (lead.cidade || '').replace(/;/g, ','),
      (lead.categoria || '').replace(/;/g, ','),
      (lead.status || '').replace(/;/g, ','),
      (lead.ultimoContato ? new Date(lead.ultimoContato).toLocaleDateString('pt-BR') : ''),
      (lead.respostas || 0)
    ].join(';'));
    // Adiciona BOM UTF-8 para Excel reconhecer acentuação
    const csvContent = '\uFEFF' + csvHeader + csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'leads.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Leads</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe todos os seus prospects</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 bg-gradient-primary text-white">
            <MessageSquare className="w-4 h-4" />
            Importar Leads
          </Button>
          <Button className="gap-2 bg-gradient-primary text-white" onClick={exportarLeadsCSV}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16.5a1 1 0 0 1-1-1V5.83l-3.59 3.58A1 1 0 0 1 6 8.59a1 1 0 0 1 0-1.41l5-5a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1-1.41 1.41L13 5.83V15.5a1 1 0 0 1-1 1Z"/><path fill="currentColor" d="M19 20.5H5a1 1 0 0 1 0-2h14a1 1 0 0 1 0 2Z"/></svg>
            Exportar Leads
          </Button>
        </div>
      </div>

      <form onSubmit={handleCriar} className="flex flex-wrap gap-2 items-end">
        <Input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <Input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
        <Input placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} />
        <Input placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} />
        <Button type="submit">Adicionar Lead</Button>
      </form>
      {erro && <div className="text-destructive text-center">{erro}</div>}
      {sucesso && <div className="text-green-600 text-center">{sucesso}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <stat.icon className="w-8 h-8 text-primary mr-4" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, telefone ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Status: {statusFilter === 'todos' ? 'Todos' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover">
                <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('todos')}>
                  Todos os Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('quente')}>
                  Leads Quentes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('respondido')}>
                  Responderam
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('enviado')}>
                  Mensagem Enviada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('ignorado')}>
                  Ignoraram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pendente')}>
                  Pendentes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads ({filteredLeads.length})</CardTitle>
          <CardDescription>
            Gerencie seus contatos e acompanhe o status de cada lead
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando leads...</div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Contato</TableHead>
                <TableHead>Respostas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="font-medium">{lead.nome}</div>
                      {lead.whatsapp && (
                        <Phone className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </TableCell>
                    <TableCell className="font-mono text-sm">{lead.telefone}</TableCell>
                    <TableCell>{lead.cidade}</TableCell>
                  <TableCell>
                      <Badge variant="outline">{lead.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(lead.status)}
                  </TableCell>
                  <TableCell>
                    {lead.ultimoContato ? new Date(lead.ultimoContato).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                      <Badge variant="secondary">{lead.respostas || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Ações
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-popover">
                        <DropdownMenuItem onClick={() => openEditModal(lead)}>Editar Lead</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/conversas-whatsapp?lead=${encodeURIComponent(lead.telefone)}`)}>Ver Conversa</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openSendModal(lead)}>Enviar Mensagem</DropdownMenuItem>
                        <DropdownMenuItem>Marcar como Quente</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { closeEditModal(); setTimeout(() => handleExcluir(lead.id), 100); }}>
                          Parar Follow-up / Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de edição do lead */}
      <Dialog open={!!editLead} onOpenChange={closeEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input placeholder="Nome" value={editNome} onChange={e => setEditNome(e.target.value)} />
            <Input placeholder="Telefone" value={editTelefone} onChange={e => setEditTelefone(e.target.value)} />
            <Input placeholder="Cidade" value={editCidade} onChange={e => setEditCidade(e.target.value)} />
            <Input placeholder="Categoria" value={editCategoria} onChange={e => setEditCategoria(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleEditSave}>Salvar</Button>
            <Button variant="outline" onClick={closeEditModal}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de envio de mensagem */}
      <Dialog open={!!sendLead} onOpenChange={closeSendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Mensagem</DialogTitle>
          </DialogHeader>
          {sendLead && (
            <div className="flex flex-col gap-2">
              <div><b>{sendLead.nome}</b> <span className="text-muted-foreground">({sendLead.telefone})</span></div>
              <select className="border rounded p-2" value={sessaoSelecionada} onChange={e => setSessaoSelecionada(e.target.value)} disabled={sending} required>
                <option value="">Selecione a sessão do WhatsApp</option>
                {sessoes.map(s => (
                  <option key={s.id} value={s.id}>{s.id} ({s.status})</option>
                ))}
              </select>
              <Input placeholder="Digite a mensagem..." value={sendMessage} onChange={e => setSendMessage(e.target.value)} disabled={sending} />
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSendMessage} disabled={sending || !sendMessage.trim() || !sessaoSelecionada}>Enviar</Button>
            <Button variant="outline" onClick={closeSendModal} disabled={sending}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leads;