import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { TopNav } from '@/components/TopNav';

export const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        {/* Sidebar com transição suave de largura */}
        <div
          className={`transition-all duration-300 ease-in-out h-screen z-30 bg-[#181C23] border-r border-[#23272f] ${sidebarCollapsed ? 'w-[80px]' : 'w-[300px]'} fixed top-0 left-0`}
        >
          <AppSidebar collapsed={sidebarCollapsed} />
        </div>
        {/* Conteúdo principal */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-[80px]' : 'ml-[300px]'}`}
        >
          <TopNav onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />
          <main className="flex-1 p-4 md:p-6 bg-background overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};