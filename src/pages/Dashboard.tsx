import React from 'react';
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

const Dashboard = () => {
  const stats = [
    {
      title: 'Total de Leads',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Mensagens Enviadas',
      value: '1,234',
      change: '+8%',
      icon: MessageSquare,
      color: 'text-accent'
    },
    {
      title: 'Taxa de Resposta',
      value: '23.5%',
      change: '+5%',
      icon: Check,
      color: 'text-success'
    },
    {
      title: 'Leads Quentes',
      value: '156',
      change: '+15%',
      icon: TrendingUp,
      color: 'text-warning'
    }
  ];

  const recentCampaigns = [
    {
      name: 'Restaurantes São Paulo',
      status: 'Ativa',
      leads: 245,
      sent: 189,
      responses: 45,
      progress: 77
    },
    {
      name: 'Academias Rio de Janeiro',
      status: 'Pausada',
      leads: 180,
      sent: 120,
      responses: 28,
      progress: 67
    },
    {
      name: 'Salões de Beleza BH',
      status: 'Ativa',
      leads: 320,
      sent: 298,
      responses: 72,
      progress: 93
    }
  ];

  const recentActivity = [
    { time: '10:30', action: 'Nova resposta de "Restaurante do João"', type: 'response' },
    { time: '09:15', action: 'Campanha "Academias RJ" pausada', type: 'pause' },
    { time: '08:45', action: '15 novos leads coletados', type: 'leads' },
    { time: '07:30', action: 'Mensagem enviada para 45 leads', type: 'message' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-medium transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <Badge variant="secondary" className="text-xs mt-1">
                {stat.change} vs mês anterior
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Campanhas Recentes
            </CardTitle>
            <CardDescription>
              Acompanhe o progresso das suas campanhas ativas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{campaign.name}</p>
                    <Badge 
                      variant={campaign.status === 'Ativa' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{campaign.leads} leads</span>
                    <span>{campaign.sent} enviadas</span>
                    <span>{campaign.responses} respostas</span>
                  </div>
                  <Progress value={campaign.progress} className="w-40 h-2" />
                </div>
                <Button variant="ghost" size="sm">
                  Ver detalhes
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="p-6 h-auto flex-col gap-2">
              <Search className="w-6 h-6" />
              <span>Buscar Leads</span>
              <span className="text-xs text-muted-foreground">Encontre novos prospects</span>
            </Button>
            <Button variant="outline" className="p-6 h-auto flex-col gap-2">
              <MessageSquare className="w-6 h-6" />
              <span>Criar Campanha</span>
              <span className="text-xs text-muted-foreground">Configure uma nova campanha</span>
            </Button>
            <Button variant="outline" className="p-6 h-auto flex-col gap-2">
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