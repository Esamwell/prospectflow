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
  Phone,
  LayoutGrid,
  List as ListIcon,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

import { API_BASE } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const API_URL = `${API_BASE}/api/leads`;

const Leads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  
  // Forms
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  
  const [editLead, setEditLead] = useState<any>(null);
  const [editNome, setEditNome] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editCidade, setEditCidade] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  
  // Mensagens
  const [sendLead, setSendLead] = useState<any>(null);
  const [sendMessage, setSendMessage] = useState('');
  const [templates, setTemplates] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const carregarLeads = () => {
    setLoading(true);
    fetch(API_URL, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.status === 401) {
          toast({ title: 'Sessão expirada', variant: 'destructive' });
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
        toast({ title: 'Erro ao carregar leads', variant: 'destructive' });
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarLeads();
    
    // Load Templates
    const loadedTpls = localStorage.getItem('prospectflow_templates');
    if (loadedTpls) {
      try { setTemplates(JSON.parse(loadedTpls)); } catch(e){}
    }
  }, []);

  const handleCriar = async (e: any) => {
    e.preventDefault();
    setErro('');
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
      toast({ title: 'Lead criado com sucesso!' });
      carregarLeads();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao criar lead');
    }
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este lead?')) return;
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    if (res.ok) {
      toast({ title: 'Lead removido!' });
      carregarLeads();
    } else {
      toast({ title: 'Erro ao remover lead', variant: 'destructive' });
    }
  };
  
  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast({ title: 'Status atualizado com sucesso!' });
        carregarLeads();
      } else {
        toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Erro na comunicação', variant: 'destructive' });
    }
  };

  const openEditModal = (lead: any) => {
    setEditLead(lead);
    setEditNome(lead.nome);
    setEditTelefone(lead.telefone);
    setEditCidade(lead.cidade || '');
    setEditCategoria(lead.categoria || '');
  };

  const closeEditModal = () => {
    setEditLead(null);
  };

  const handleEditSave = async () => {
    if (!editLead) return;
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
        toast({ title: 'Lead atualizado com sucesso!' });
        closeEditModal();
        carregarLeads();
      } else {
        toast({ title: 'Erro ao atualizar lead', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Erro ao atualizar lead', variant: 'destructive' });
    }
  };

  const openSendModal = (lead: any) => {
    setSendLead(lead);
    setSendMessage('');
  };

  const closeSendModal = () => {
    setSendLead(null);
    setSendMessage('');
  };

  const applyTemplate = (template: any) => {
    if (!sendLead) return;
    let text = template.content;
    text = text.replace('{nome}', sendLead.nome);
    text = text.replace('{cidade}', sendLead.cidade || '');
    text = text.replace('{empresa}', sendLead.nome); // Fallback para empresa
    setSendMessage(text);
  };

  const handleSendMessageWhatsApp = () => {
    if (!sendLead || !sendMessage.trim()) return;
    const phone = sendLead.telefone.replace(/\D/g, '');
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(sendMessage)}`;
    window.open(url, '_blank');
    closeSendModal();
    // Move lead status to "enviado"
    updateStatus(sendLead.id, 'enviado');
  };

  const safeLeads = Array.isArray(leads) ? leads : [];
  const filteredLeads = safeLeads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.telefone.includes(searchTerm) ||
                         (lead.cidade && lead.cidade.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total de Leads', value: safeLeads.length, icon: Users },
    { label: 'Leads Quentes', value: safeLeads.filter(l => l.status === 'quente').length, icon: Users },
    { label: 'Enviados', value: safeLeads.filter(l => l.status === 'enviado').length, icon: Check },
    { label: 'Pendentes', value: safeLeads.filter(l => l.status === 'pendente').length, icon: Clock }
  ];

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      'quente': { variant: 'default', color: 'bg-[#FF9500] text-black', dot: 'bg-black', label: 'Quente' },
      'morno': { variant: 'default', color: 'bg-yellow-500/20 text-yellow-500', dot: 'bg-yellow-500', label: 'Morno' },
      'frio': { variant: 'default', color: 'bg-blue-500/20 text-blue-500', dot: 'bg-blue-500', label: 'Frio' },
      'respondido': { variant: 'default', color: 'bg-green-500/20 text-green-500', dot: 'bg-green-500', label: 'Respondeu' },
      'enviado': { variant: 'secondary', color: 'bg-purple-500/20 text-purple-500', dot: 'bg-purple-500', label: 'Enviado' },
      'ignorado': { variant: 'secondary', color: 'bg-gray-500/20 text-gray-500', dot: 'bg-gray-500', label: 'Ignorado' },
      'pendente': { variant: 'outline', color: 'bg-zinc-800 text-zinc-300', dot: 'bg-zinc-500', label: 'Pendente' }
    };
    const config = configs[status] || { variant: 'outline', color: 'bg-zinc-800 text-zinc-300', dot: 'bg-zinc-500', label: status };
    return (
      <Badge className={`gap-1 border-none ${config.color}`.trim()} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <span className={`w-2 h-2 rounded-full ${config.dot} mr-1`} />
        {config.label}
      </Badge>
    );
  };

  const exportarLeadsCSV = () => {
    const csvHeader = 'Nome;Telefone;Cidade;Categoria;Status;Último Contato;Site\r\n';
    const csvRows = filteredLeads.map(lead => [
      (lead.nome || '').replace(/;/g, ','),
      (lead.telefone || '').replace(/;/g, ','),
      (lead.cidade || '').replace(/;/g, ','),
      (lead.categoria || '').replace(/;/g, ','),
      (lead.status || '').replace(/;/g, ','),
      (lead.ultimoContato ? new Date(lead.ultimoContato).toLocaleDateString('pt-BR') : ''),
      (lead.site || '').replace(/;/g, ',')
    ].join(';'));
    const csvContent = '\uFEFF' + csvHeader + csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'leads.csv');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const importedLeads = results.data;
        let success = 0, fail = 0;
        for (const lead of importedLeads) {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(lead)
          });
          if (res.ok) success++;
          else fail++;
        }
        toast({ title: `${success} leads importados com sucesso!` });
        if (fail) toast({ title: `${fail} leads falharam ao importar.`, variant: 'destructive' });
        carregarLeads();
      },
      error: () => toast({ title: 'Erro ao ler o arquivo CSV', variant: 'destructive' })
    });
  };

  const KanbanColumn = ({ title, status, items }: { title: string, status: string, items: any[] }) => {
    return (
      <div className="bg-[#1c1c1e] rounded-xl p-4 min-w-[300px] flex-shrink-0 flex flex-col h-full border border-gray-800">
        <h3 className="font-bold text-lg mb-4 text-white flex justify-between items-center">
          {title} <span className="bg-black text-[#FF9500] px-2 py-0.5 rounded-full text-xs">{items.length}</span>
        </h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {items.map(lead => (
            <Card key={lead.id} className="bg-black border-gray-800 shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-white truncate pr-2">{lead.nome}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400">
                        <ListIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1c1c1e] text-white border-gray-800">
                      <DropdownMenuItem onClick={() => openEditModal(lead)}>Editar Lead</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openSendModal(lead)}>Enviar Mensagem</DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuLabel className="text-xs text-gray-500">Mover para</DropdownMenuLabel>
                      {['pendente', 'frio', 'morno', 'quente', 'enviado', 'respondido', 'ignorado'].filter(s => s !== status).map(s => (
                        <DropdownMenuItem key={s} onClick={() => updateStatus(lead.id, s)}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem className="text-red-500 focus:text-red-600 focus:bg-red-500/10" onClick={() => handleExcluir(lead.id)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="text-sm text-gray-400 font-mono mb-2">{lead.telefone}</div>
                <div className="flex justify-between items-center mt-4">
                  <Badge variant="outline" className="border-gray-800 text-gray-400 bg-transparent">{lead.categoria || 'Sem categoria'}</Badge>
                  <Button size="sm" className="bg-[#FF9500] hover:bg-[#FF9500]/90 text-black h-7 px-2" onClick={() => openSendModal(lead)}>
                    <MessageSquare className="w-3 h-3 mr-1" /> Falar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-gray-600 text-sm italic">Nenhum lead nesta etapa</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestão de Leads</h1>
          <p className="text-gray-400">Gerencie e acompanhe seus prospects de prospecção fria</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white border border-gray-800" onClick={handleImportClick}>
            Importar
          </Button>
          <input type="file" accept=".csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <Button className="gap-2 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white border border-gray-800" onClick={exportarLeadsCSV}>
            Exportar
          </Button>
        </div>
      </div>

      <form onSubmit={handleCriar} className="flex flex-wrap gap-2 items-end bg-[#1c1c1e] p-4 rounded-xl border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
          <Input placeholder="Nome da Empresa/Lead" value={nome} onChange={e => setNome(e.target.value)} className="bg-black border-gray-800 text-white focus:border-[#FF9500]" />
          <Input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} className="bg-black border-gray-800 text-white focus:border-[#FF9500]" />
          <Input placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} className="bg-black border-gray-800 text-white focus:border-[#FF9500]" />
          <Input placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} className="bg-black border-gray-800 text-white focus:border-[#FF9500]" />
        </div>
        <Button type="submit" className="bg-[#FF9500] hover:bg-[#FF9500]/90 text-black font-semibold">Adicionar Lead</Button>
      </form>
      
      {erro && <div className="text-red-500 text-sm font-medium">{erro}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#1c1c1e] border-none shadow-md">
            <CardContent className="flex items-center p-6">
              <div className="bg-black p-3 rounded-full mr-4">
                <stat.icon className="w-6 h-6 text-[#FF9500]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-[#1c1c1e] p-4 rounded-xl border border-gray-800">
        <div className="flex gap-4 flex-wrap flex-1 w-full">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-black border-gray-800 text-white focus:border-[#FF9500] w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-black border-gray-800 text-white hover:bg-[#2c2c2e]">
                <Filter className="w-4 h-4" />
                Status: {statusFilter === 'todos' ? 'Todos' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1c1c1e] text-white border-gray-800">
              <DropdownMenuItem onClick={() => setStatusFilter('todos')}>Todos os Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pendente')}>Pendentes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('frio')}>Frios</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('morno')}>Mornos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('quente')}>Quentes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('enviado')}>Enviados</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('respondido')}>Responderam</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex bg-black rounded-lg p-1 border border-gray-800">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-3 ${viewMode === 'table' ? 'bg-[#2c2c2e] text-white' : 'text-gray-500 hover:text-white'}`}
            onClick={() => setViewMode('table')}
          >
            <ListIcon className="w-4 h-4 mr-2" /> Tabela
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-3 ${viewMode === 'kanban' ? 'bg-[#2c2c2e] text-white' : 'text-gray-500 hover:text-white'}`}
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> Kanban
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#FF9500] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        viewMode === 'table' ? (
          <Card className="bg-[#1c1c1e] border-gray-800 shadow-md">
            <CardHeader className="pb-0">
              <CardTitle className="text-white">Lista de Leads</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader className="border-gray-800">
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">Empresa</TableHead>
                    <TableHead className="text-gray-400">Telefone</TableHead>
                    <TableHead className="text-gray-400">Localização</TableHead>
                    <TableHead className="text-gray-400">Categoria</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-gray-800 hover:bg-[#2c2c2e] transition-colors">
                      <TableCell className="font-medium text-white">{lead.nome}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-300">{lead.telefone}</TableCell>
                      <TableCell className="text-gray-300">{lead.cidade}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-700 text-gray-400 bg-black">{lead.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Opções</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1c1c1e] text-white border-gray-800">
                            <DropdownMenuItem onClick={() => openEditModal(lead)}>Editar Lead</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openSendModal(lead)}>Enviar Mensagem</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-800" />
                            <DropdownMenuItem onClick={() => updateStatus(lead.id, 'quente')}>Marcar como Quente</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(lead.id, 'ignorado')}>Marcar como Ignorado</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-800" />
                            <DropdownMenuItem className="text-red-500 focus:text-red-600 focus:bg-red-500/10" onClick={() => handleExcluir(lead.id)}>
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredLeads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">Nenhum lead encontrado.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 h-[600px]">
            <KanbanColumn title="Pendente" status="pendente" items={filteredLeads.filter(l => l.status === 'pendente' || !l.status)} />
            <KanbanColumn title="Frio" status="frio" items={filteredLeads.filter(l => l.status === 'frio')} />
            <KanbanColumn title="Enviado" status="enviado" items={filteredLeads.filter(l => l.status === 'enviado')} />
            <KanbanColumn title="Morno/Quente" status="quente" items={filteredLeads.filter(l => l.status === 'morno' || l.status === 'quente')} />
            <KanbanColumn title="Respondido" status="respondido" items={filteredLeads.filter(l => l.status === 'respondido')} />
            <KanbanColumn title="Ignorado" status="ignorado" items={filteredLeads.filter(l => l.status === 'ignorado')} />
          </div>
        )
      )}

      {/* Modal de Edição */}
      <Dialog open={!!editLead} onOpenChange={closeEditModal}>
        <DialogContent className="bg-[#1c1c1e] text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Input placeholder="Nome" value={editNome} onChange={e => setEditNome(e.target.value)} className="bg-black border-gray-800 focus:border-[#FF9500]" />
            <Input placeholder="Telefone" value={editTelefone} onChange={e => setEditTelefone(e.target.value)} className="bg-black border-gray-800 focus:border-[#FF9500]" />
            <Input placeholder="Cidade" value={editCidade} onChange={e => setEditCidade(e.target.value)} className="bg-black border-gray-800 focus:border-[#FF9500]" />
            <Input placeholder="Categoria" value={editCategoria} onChange={e => setEditCategoria(e.target.value)} className="bg-black border-gray-800 focus:border-[#FF9500]" />
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-gray-800 text-black hover:bg-gray-800" onClick={closeEditModal}>Cancelar</Button>
            <Button className="bg-[#FF9500] text-white hover:bg-[#FF9500]/90" onClick={handleEditSave}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Envio de Mensagem (WhatsApp Web) */}
      <Dialog open={!!sendLead} onOpenChange={closeSendModal}>
        <DialogContent className="bg-[#1c1c1e] text-white border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#FF9500]" />
              Criar Mensagem (WhatsApp Web)
            </DialogTitle>
            <DialogDescription>
              Escolha um template ou digite a mensagem para enviar via WhatsApp Web para <b>{sendLead?.nome}</b>.
            </DialogDescription>
          </DialogHeader>
          {sendLead && (
            <div className="flex flex-col gap-4 py-4">
              <div className="bg-black p-4 rounded-lg border border-gray-800">
                <div className="font-bold text-lg">{sendLead.nome}</div>
                <div className="text-gray-400 font-mono">{sendLead.telefone}</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Escolher Template Rápido</label>
                <div className="flex flex-wrap gap-2">
                  {templates.map(t => (
                    <Button key={t.id} variant="outline" size="sm" className="bg-black border-gray-700 hover:border-[#FF9500] text-gray-300" onClick={() => applyTemplate(t)}>
                      {t.title}
                    </Button>
                  ))}
                  {templates.length === 0 && (
                    <span className="text-sm text-gray-600 italic">Nenhum template cadastrado. Crie em Configurações.</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Mensagem</label>
                <textarea 
                  className="w-full min-h-[150px] p-3 rounded-md bg-black border border-gray-800 text-white focus:border-[#FF9500] focus:ring-1 focus:ring-[#FF9500] outline-none resize-y"
                  placeholder="Digite a mensagem..." 
                  value={sendMessage} 
                  onChange={e => setSendMessage(e.target.value)} 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="border-gray-800 text-black hover:bg-gray-800" onClick={closeSendModal}>Cancelar</Button>
            <Button className="bg-[#FF9500] text-white hover:bg-[#FF9500]/90 font-bold gap-2" onClick={handleSendMessageWhatsApp} disabled={!sendMessage.trim()}>
              Abrir WhatsApp Web
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leads;