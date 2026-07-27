import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import NotFound from "./pages/NotFound";
import Campaigns from "./pages/Campaigns";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Usuarios from "./pages/Usuarios";
import Login from "./pages/Login";
import CompanyProfiles from "./pages/CompanyProfiles";
import Templates from "./pages/Templates";
import LeadsCampanha from "./pages/LeadsCampanha";
import ScrapingLeads from "./pages/ScrapingLeads";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="search" element={<Search />} />
            <Route path="settings" element={<Settings />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="leads-campanha" element={<LeadsCampanha />} />
            <Route path="scraping-leads" element={<ScrapingLeads />} />
            <Route path="company-profiles" element={<CompanyProfiles />} />
            <Route path="templates" element={<Templates />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
