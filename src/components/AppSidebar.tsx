import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Calendar,
  Check,
  Settings,
  Users,
  MessageSquare,
  Search
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Calendar,
  },
  {
    title: 'Leads',
    url: '/leads',
    icon: Users,
  },
  {
    title: 'Busca',
    url: '/search',
    icon: Search,
  },
  {
    title: 'Configurações',
    url: '/settings',
    icon: Settings,
  },
  {
    title: 'Usuários',
    url: '/usuarios',
    icon: Users,
  },
  {
    title: 'Leads por Campanha',
    url: '/leads-campanha',
    icon: Users,
  },
  {
    title: 'Scraping de Leads',
    url: '/scraping-leads',
    icon: Users,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">ProspectFlow</h2>
              <p className="text-xs text-sidebar-foreground/70">Automação IA</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="campanhas-mensagens">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4" />
                      {!isCollapsed && <span>Campanhas e Mensagens</span>}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-1 pl-6">
                      <NavLink to="/campaigns" className={({ isActive }) => isActive ? 'font-semibold text-primary' : ''}>
                        Listar Campanhas
                      </NavLink>
                      <NavLink to="/mensagens" className={({ isActive }) => isActive ? 'font-semibold text-primary' : ''}>
                        Caixa de Mensagens
                      </NavLink>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="whatsapp">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4" />
                      {!isCollapsed && <span>WhatsApp</span>}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-1 pl-6">
                      <NavLink to="/conexao-whatsapp" className={({ isActive }) => isActive ? 'font-semibold text-primary' : ''}>
                        Conexão WhatsApp
                      </NavLink>
                      <NavLink to="/whatsapp-sessoes" className={({ isActive }) => isActive ? 'font-semibold text-primary' : ''}>
                        Sessões WhatsApp
                      </NavLink>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}