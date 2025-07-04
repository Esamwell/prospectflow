import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, Users } from 'lucide-react';

const API_STATUS = '/api/whatsapp/status-web';

export function TopNav({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [waStatus, setWaStatus] = useState('');

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/whatsapp/sessions')
        .then(res => res.json())
        .then(data => {
          const anyConnected = Array.isArray(data) && data.some(s => s.status === 'conectado');
          setWaStatus(anyConnected ? 'conectado' : 'desconectado');
        });
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();

  const handleLogout = () => {
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="h-16 bg-white dark:bg-[#181C23] border-b border-border shadow-sm flex items-center justify-between px-6 transition-all duration-300" style={{ fontFamily: 'Inter, sans-serif', zIndex: 20 }}>
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#23272f] p-2 transition-colors" size="icon" onClick={onToggleSidebar}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 15h6"/></svg>
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground leading-tight">Olá, {user.nome || 'Usuário'}</h1>
          <p className="text-xs text-muted-foreground leading-tight">Bem-vindo ao ProspectFlow</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${waStatus === 'conectado' ? 'bg-success' : 'bg-yellow-500'} transition-colors`} />
          <span className="text-muted-foreground select-none">
            {waStatus === 'conectado' ? 'WhatsApp conectado' : 'WhatsApp desconectado'}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-[#23272f] transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.nome)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover shadow-lg border border-border" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.nome || 'Usuário'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email || ''}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}