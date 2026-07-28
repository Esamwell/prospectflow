import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  Check, 
  Clock,
  TrendingUp,
  Calendar,
  Search,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { API_BASE } from '@/lib/api';
const API_DASHBOARD = `${API_BASE}/api/dashboard`;

const Dashboard = () => {
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_DASHBOARD)
      .then(res => res.json())
      .then(data => { setDados(data); setLoading(false); })
      .catch(() => { setErro('Erro ao carregar dados do dashboard'); setLoading(false); });
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando dashboard...</div>;
  if (erro) return <div className="p-8 text-center text-destructive">{erro}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de prospecção</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2" onClick={() => fetchDados(true)}>
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Leads</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dados.totalLeads}</div>
            <Badge variant="secondary" className="text-xs mt-1">Atualizado</Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Frios</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dados.leadsFrios}</div>
            <Badge variant="secondary" className="text-xs mt-1">Atualizado</Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Mornos</CardTitle>
            <Check className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dados.leadsMornos}</div>
            <Badge variant="secondary" className="text-xs mt-1">Atualizado</Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-medium transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Quentes</CardTitle>
            <TrendingUp className="w-4 h-4 text-[#FF9500]" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-foreground">{dados.leadsQuentes}</div>
            <Badge variant="secondary" className="text-xs mt-1">Atualizado</Badge>
            </CardContent>
          </Card>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Últimos Leads Encontrados
            </CardTitle>
            <CardDescription>Veja os leads mais recentes capturados no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(dados?.ultimosLeads || []).map((l: any, i: number) => (
              <div key={l.id || i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{l.nome}</p>
                    <Badge variant={l.status === 'quente' ? 'default' : 'secondary'} className="text-xs">{l.status}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{l.telefone}</span>
                    <span>{l.cidade}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>Ver na Base</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="p-6 h-auto flex-col gap-2" onClick={() => navigate('/scraping-leads')}>
              <Search className="w-6 h-6" />
              <span>Buscar Leads</span>
              <span className="text-xs text-muted-foreground">Encontre novos prospects</span>
            </Button>
            <Button variant="outline" className="p-6 h-auto flex-col gap-2" onClick={() => navigate('/campaigns')}>
              <MessageSquare className="w-6 h-6" />
              <span>Criar Campanha</span>
              <span className="text-xs text-muted-foreground">Configure uma nova campanha</span>
            </Button>
            <Button variant="outline" className="p-6 h-auto flex-col gap-2" onClick={() => navigate('/leads')}>
              <Users className="w-6 h-6" />
              <span>Ver Leads</span>
              <span className="text-xs text-muted-foreground">Gerencie seus contatos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;