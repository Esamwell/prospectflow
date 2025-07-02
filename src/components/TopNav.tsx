<<<<<<< HEAD
import React from 'react';
=======
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
>>>>>>> f582084 (Commit inicial do projeto conectado ao GitHub)
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

<<<<<<< HEAD
export function TopNav() {
  const user = {
    name: 'João Silva',
    email: 'joao@empresa.com',
    avatar: '/placeholder-avatar.jpg'
=======
const API_STATUS = 'http://localhost:4000/api/whatsapp/status';

export function TopNav() {
  const navigate = useNavigate();
  const [waStatus, setWaStatus] = useState('');

  useEffect(() => {
    const fetchStatus = () => {
      fetch(API_STATUS)
        .then(res => res.json())
        .then(data => setWaStatus(data.status));
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
>>>>>>> f582084 (Commit inicial do projeto conectado ao GitHub)
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Bem-vindo ao ProspectFlow</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
<<<<<<< HEAD
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-muted-foreground">WhatsApp conectado</span>
=======
          <div className={`w-2 h-2 rounded-full ${waStatus === 'conectado' ? 'bg-success' : 'bg-yellow-500'}`}></div>
          <span className="text-muted-foreground">
            {waStatus === 'conectado' ? 'WhatsApp conectado' : 'WhatsApp desconectado'}
          </span>
>>>>>>> f582084 (Commit inicial do projeto conectado ao GitHub)
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
<<<<<<< HEAD
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
=======
                <p className="text-sm font-medium leading-none">{user.nome || 'Usuário'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email || ''}
>>>>>>> f582084 (Commit inicial do projeto conectado ao GitHub)
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
<<<<<<< HEAD
            <DropdownMenuItem>
=======
            <DropdownMenuItem onClick={() => navigate('/settings')}>
>>>>>>> f582084 (Commit inicial do projeto conectado ao GitHub)
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
<<<<<<< HEAD
            <DropdownMenuItem className="text-destructive">
=======
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
>>>>>>> f582084 (Commit inicial do projeto conectado ao GitHub)
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}