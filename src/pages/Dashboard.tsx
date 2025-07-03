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
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_DASHBOARD = 'http://localhost:4000/api/dashboard';

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
          <p className="text-muted-foreground">Visão geral das suas campanhas de prospecção</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Search className="w-4 h-4" />
            Buscar Leads
          </Button>
          <Button className="gap-2 bg-gradient-primary text-white">
            <MessageSquare className="w-4 h-4" />
            Nova Campanha
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Mensagens Enviadas</CardTitle>
            <MessageSquare className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dados.totalMensagens}</div>
            <Badge variant="secondary" className="text-xs mt-1">Atualizado</Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Resposta</CardTitle>
            <Check className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dados.taxaResposta.toFixed(1)}%</div>
            <Badge variant="secondary" className="text-xs mt-1">Atualizado</Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-medium transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Quentes</CardTitle>
            <TrendingUp className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-foreground">{dados.leadsQuentes}</div>
            <Badge variant="secondary" className="text-xs mt-1">Atualizado</Badge>
            </CardContent>
          </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Campanhas Recentes
            </CardTitle>
            <CardDescription>Acompanhe o progresso das suas campanhas ativas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dados.campanhasRecentes.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{c.nome}</p>
                    <Badge variant={c.status === 'ativa' ? 'default' : 'secondary'} className="text-xs">{c.status}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>ID: {c.id}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Ver detalhes</Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dados.atividadesRecentes.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Mensagem para <b>{a.Lead?.nome || 'Lead'}</b> na campanha <b>{a.Campaign?.nome || 'Campanha'}</b></p>
                    <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
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