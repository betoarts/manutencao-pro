import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import AssetsPage from '@/pages/AssetsPage';
import MaintenancePlansPage from '@/pages/MaintenancePlansPage';
import WorkOrdersPage from '@/pages/WorkOrdersPage';
import InventoryPage from '@/pages/InventoryPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/maintenance-plans" element={<MaintenancePlansPage />} />
          <Route path="/work-orders" element={<WorkOrdersPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
