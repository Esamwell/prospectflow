import React, { useEffect, useState } from 'react';
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
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSucesso('Lead removido!');
      carregarLeads();
    } else {
      setErro('Erro ao remover lead');
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

  const stats = [
    { label: 'Total de Leads', value: safeLeads.length, icon: Users },
    { label: 'Leads Quentes', value: safeLeads.filter(l => l.status === 'quente').length, icon: Users },
    { label: 'Responderam', value: safeLeads.filter(l => l.status === 'respondido').length, icon: Check },
    { label: 'Pendentes', value: safeLeads.filter(l => l.status === 'pendente').length, icon: Clock }
  ];

  const getStatusBadge = (status) => {
    const configs = {
      'quente': { variant: 'default', color: 'bg-red-500', label: 'Quente' },
      'respondido': { variant: 'default', color: 'bg-green-500', label: 'Respondeu' },
      'enviado': { variant: 'secondary', color: 'bg-blue-500', label: 'Enviado' },
      'ignorado': { variant: 'secondary', color: 'bg-gray-500', label: 'Ignorado' },
      'pendente': { variant: 'outline', color: 'bg-yellow-500', label: 'Pendente' }
    };
    const config = configs[status] || { variant: 'outline', color: '', label: status };
    return (
      <Badge variant={config.variant} className="gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Leads</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe todos os seus prospects</p>
        </div>
        <Button className="gap-2 bg-gradient-primary text-white">
          <MessageSquare className="w-4 h-4" />
          Importar Leads
        </Button>
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
                    {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                      <Badge variant="secondary">{lead.responses || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Ações
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-popover">
                        <DropdownMenuItem>Ver Conversa</DropdownMenuItem>
                        <DropdownMenuItem>Marcar como Quente</DropdownMenuItem>
                        <DropdownMenuItem>Enviar Mensagem</DropdownMenuItem>
                        <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleExcluir(lead.id)}>
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
    </div>
  );
};

export default Leads;