import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  UserPlus,
  Settings,
  UserCog,
  Building2,
  ListChecks,
  Search as SearchIcon,
  MessageSquare
} from 'lucide-react';

export function AppSidebar({ collapsed = false }) {
  const location = useLocation();
  return (
    <Sidebar backgroundColor="#181C23" width="300px" rootStyles={{ borderRight: '1px solid #23272f', height: '100vh', position: 'fixed', left: 0, top: 0, overflow: 'hidden' }} collapsed={collapsed}>
      <div className="flex flex-col items-center justify-center py-6">
        <img src="/logowhite-prospect.png" alt="Logo ProspectFlow" className="w-20 h-auto mb-2" />
          </div>
      <div className="border-b border-white/20 w-4/5 mx-auto mb-4" />
      <Menu
        menuItemStyles={{
          button: ({ active, level }) => {
            if (level === 1) {
              return {
                color: active ? '#6366f1' : '#b6c8d9',
                background: 'transparent',
                fontSize: 15,
              };
            }
            return {
              color: active ? '#2563eb' : '#b6c8d9',
              backgroundColor: active ? '#e0e7ff' : 'transparent',
              borderRadius: '8px',
              margin: '8px 12px',
              padding: '10px 14px',
              fontWeight: active ? 700 : 500,
              fontSize: 15,
              minHeight: 40,
              maxWidth: 260,
              width: '98%',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              whiteSpace: 'normal',
              overflow: 'visible',
              textOverflow: 'unset',
              boxShadow: active ? '0 2px 8px 0 rgba(37,99,235,0.10)' : undefined,
              transition: 'all 0.2s',
            };
          },
          icon: ({ active, level }) => ({ color: active && level === 0 ? '#2563eb' : '#b6c8d9', fontSize: 20 }),
          label: { fontSize: 15 },
        }}
      >
        <div className="uppercase text-xs text-white/50 font-bold px-4 pt-2 pb-1 tracking-widest">Menu Principal</div>
        <MenuItem icon={<LayoutDashboard />} component={<Link to="/" />} active={location.pathname === '/'}>Dashboard</MenuItem>
        <MenuItem icon={<UserPlus />} component={<Link to="/leads" />} active={location.pathname === '/leads'}>Leads</MenuItem>
        <MenuItem icon={<Settings />} component={<Link to="/settings" />} active={location.pathname === '/settings'}>Configurações</MenuItem>
        <MenuItem icon={<UserCog />} component={<Link to="/usuarios" />} active={location.pathname === '/usuarios'}>Usuários</MenuItem>
        <MenuItem icon={<Building2 />} component={<Link to="/company-profiles" />} active={location.pathname === '/company-profiles'}>Perfis de Empresa</MenuItem>
        <MenuItem icon={<ListChecks />} component={<Link to="/leads-campanha" />} active={location.pathname === '/leads-campanha'}>Leads por Campanha</MenuItem>
        <MenuItem icon={<SearchIcon />} component={<Link to="/scraping-leads" />} active={location.pathname === '/scraping-leads'}>Scraping de Leads</MenuItem>
        <div className="border-b border-white/10 w-4/5 mx-auto my-3" />
        <div className="uppercase text-xs text-white/50 font-bold px-4 pt-2 pb-1 tracking-widest">Outros</div>
        <SubMenu icon={<MessageSquare />} label="Campanhas e Mensagens"
          menuItemStyles={{
            button: ({ active }) => ({ color: active ? '#6366f1' : '#b6c8d9', background: 'transparent' }),
            label: { fontSize: 15 },
          }}
        >
          <MenuItem component={<Link to="/campaigns" />}>Listar Campanhas</MenuItem>
          <MenuItem component={<Link to="/mensagens" />}>Caixa de Mensagens</MenuItem>
        </SubMenu>
        <SubMenu icon={<MessageSquare />} label="WhatsApp"
          menuItemStyles={{
            button: ({ active }) => ({ color: active ? '#6366f1' : '#b6c8d9', background: 'transparent' }),
            label: { fontSize: 15 },
          }}
        >
          <MenuItem component={<Link to="/whatsapp-sessoes" />}>Sessões WhatsApp</MenuItem>
          <MenuItem component={<Link to="/conversas-whatsapp" />}>Conversas WhatsApp</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}