import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { TopNav } from '@/components/TopNav';

export const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background" style={{ paddingLeft: 300 }}>
        <AppSidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 flex flex-col">
          <TopNav onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};