import React, { useState } from 'react';
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

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const mockLeads = [
    {
      id: 1,
      name: 'Restaurante do João',
      phone: '+5511999887766',
      city: 'São Paulo',
      category: 'Restaurante',
      status: 'quente',
      lastContact: '2024-01-15',
      responses: 3,
      whatsapp: true
    },
    {
      id: 2,
      name: 'Academia Fitness Pro',
      phone: '+5511888776655',
      city: 'Rio de Janeiro',
      category: 'Academia',
      status: 'respondido',
      lastContact: '2024-01-14',
      responses: 1,
      whatsapp: true
    },
    {
      id: 3,
      name: 'Salão Beleza Total',
      phone: '+5511777665544',
      city: 'Belo Horizonte',
      category: 'Salão de Beleza',
      status: 'enviado',
      lastContact: '2024-01-13',
      responses: 0,
      whatsapp: true
    },
    {
      id: 4,
      name: 'Farmácia Central',
      phone: '+5511666554433',
      city: 'São Paulo',
      category: 'Farmácia',
      status: 'ignorado',
      lastContact: '2024-01-12',
      responses: 0,
      whatsapp: false
    },
    {
      id: 5,
      name: 'Pet Shop Amigo Fiel',
      phone: '+5511555443322',
      city: 'Curitiba',
      category: 'Pet Shop',
      status: 'pendente',
      lastContact: null,
      responses: 0,
      whatsapp: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      'quente': { variant: 'default' as const, color: 'bg-red-500', label: 'Quente' },
      'respondido': { variant: 'default' as const, color: 'bg-green-500', label: 'Respondeu' },
      'enviado': { variant: 'secondary' as const, color: 'bg-blue-500', label: 'Enviado' },
      'ignorado': { variant: 'secondary' as const, color: 'bg-gray-500', label: 'Ignorado' },
      'pendente': { variant: 'outline' as const, color: 'bg-yellow-500', label: 'Pendente' }
    };
    
    const config = configs[status as keyof typeof configs];
    return (
      <Badge variant={config.variant} className="gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        {config.label}
      </Badge>
    );
  };

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm) ||
                         lead.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total de Leads', value: mockLeads.length, icon: Users },
    { label: 'Leads Quentes', value: mockLeads.filter(l => l.status === 'quente').length, icon: Users },
    { label: 'Responderam', value: mockLeads.filter(l => l.status === 'respondido').length, icon: Check },
    { label: 'Pendentes', value: mockLeads.filter(l => l.status === 'pendente').length, icon: Clock }
  ];

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
                      <div className="font-medium">{lead.name}</div>
                      {lead.whatsapp && (
                        <Phone className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{lead.phone}</TableCell>
                  <TableCell>{lead.city}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(lead.status)}
                  </TableCell>
                  <TableCell>
                    {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{lead.responses}</Badge>
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
                        <DropdownMenuItem className="text-destructive">
                          Parar Follow-up
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;