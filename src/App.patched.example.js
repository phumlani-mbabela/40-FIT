
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import SupabaseAuthBridge from './context/SupabaseAuthBridge';
import TenantSwitcher from './components/TenantSwitcher';
import AdminTenantsPage from './pages/AdminTenantsPage';
import AdminImportsPage from './pages/AdminImportsPage';
import ProgramEditorPage from './pages/ProgramEditorPage';
import EmailTemplatesPage from './pages/EmailTemplatesPage';
import InvoiceViewerPage from './pages/InvoiceViewerPage';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30000 }}});
const persister = createSyncStoragePersister({ storage: window.localStorage });
persistQueryClient({ queryClient, persister, maxAge: 1000*60*60*24 });

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthBridge>
        <Router>
          <div className="container py-2">
            <TenantSwitcher />
          </div>
          <Routes>
            {/* TODO: add your existing routes here */}
            <Route path="/admin/tenants" element={<AdminTenantsPage/>} />
            <Route path="/admin/imports" element={<AdminImportsPage/>} />
            <Route path="/programs/new" element={<ProgramEditorPage/>} />
            <Route path="/emails" element={<EmailTemplatesPage/>} />
            <Route path="/invoices/:id" element={<InvoiceViewerPage/>} />
          </Routes>
        </Router>
      </SupabaseAuthBridge>
    </QueryClientProvider>
  );
}
