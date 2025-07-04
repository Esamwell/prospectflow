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
    <Sidebar
      backgroundColor="#181C23"
      width={collapsed ? '80px' : '300px'}
      rootStyles={{
        borderRight: '1px solid #23272f',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
        fontFamily: 'Inter, sans-serif',
      }}
      collapsed={collapsed}
    >
      <div className="flex flex-col items-center justify-center py-6">
        <img src="/logowhite-prospect.png" alt="Logo ProspectFlow" className={`transition-all duration-300 w-16 h-auto mb-2 ${collapsed ? 'scale-75' : 'scale-100'}`} />
      </div>
      <div className="border-b border-white/20 w-4/5 mx-auto mb-4" />
      <Menu
        menuItemStyles={{
          button: ({ active, level }) => ({
            color: active ? '#2563eb' : '#b6c8d9',
            background: active ? 'rgba(37,99,235,0.08)' : 'transparent',
            fontSize: 16,
            borderRadius: '8px',
            margin: '8px 12px',
            padding: collapsed ? '10px 10px' : '12px 18px',
            fontWeight: active ? 700 : 500,
            minHeight: 44,
            maxWidth: collapsed ? 60 : 260,
            width: '98%',
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 14,
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'unset',
            boxShadow: active ? '0 2px 8px 0 rgba(37,99,235,0.10)' : undefined,
            transition: 'all 0.2s',
          }),
          icon: ({ active }) => ({ color: active ? '#2563eb' : '#b6c8d9', fontSize: 22, marginRight: collapsed ? 0 : 12, transition: 'all 0.2s' }),
          label: { fontSize: 15, transition: 'opacity 0.2s', opacity: collapsed ? 0 : 1 },
        }}
      >
        <div className={`uppercase text-xs text-white/50 font-bold px-4 pt-2 pb-1 tracking-widest ${collapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>Menu Principal</div>
        <MenuItem icon={<LayoutDashboard />} component={<Link to="/" />} active={location.pathname === '/'}>Dashboard</MenuItem>
        <MenuItem icon={<UserPlus />} component={<Link to="/leads" />} active={location.pathname === '/leads'}>Leads</MenuItem>
        <MenuItem icon={<Settings />} component={<Link to="/settings" />} active={location.pathname === '/settings'}>Configurações</MenuItem>
        <MenuItem icon={<UserCog />} component={<Link to="/usuarios" />} active={location.pathname === '/usuarios'}>Usuários</MenuItem>
        <MenuItem icon={<Building2 />} component={<Link to="/company-profiles" />} active={location.pathname === '/company-profiles'}>Perfis de Empresa</MenuItem>
        <MenuItem icon={<ListChecks />} component={<Link to="/leads-campanha" />} active={location.pathname === '/leads-campanha'}>Leads por Campanha</MenuItem>
        <MenuItem icon={<SearchIcon />} component={<Link to="/scraping-leads" />} active={location.pathname === '/scraping-leads'}>Scraping de Leads</MenuItem>
        <div className="border-b border-white/10 w-4/5 mx-auto my-3" />
        <div className={`uppercase text-xs text-white/50 font-bold px-4 pt-2 pb-1 tracking-widest ${collapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>Outros</div>
        <SubMenu icon={<MessageSquare />} label="Campanhas e Mensagens">
          <MenuItem component={<Link to="/campaigns" />}>Listar Campanhas</MenuItem>
          <MenuItem component={<Link to="/mensagens" />}>Caixa de Mensagens</MenuItem>
        </SubMenu>
        <SubMenu icon={<MessageSquare />} label="WhatsApp">
          <MenuItem component={<Link to="/whatsapp-sessoes" />}>Sessões WhatsApp</MenuItem>
          <MenuItem component={<Link to="/conversas-whatsapp" />}>Conversas WhatsApp</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}