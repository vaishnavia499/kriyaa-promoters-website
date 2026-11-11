import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Projects } from './views/Projects';
import { Properties } from './views/Properties';
import { Leads } from './views/Leads';
import { Settings } from './views/Settings';
import { PlotManagement } from './views/PlotManagement';
import { PropertyDetailDrawer } from './components/PropertyDetailDrawer';
import { PropertyFormModal } from './components/PropertyFormModal';
import { ProjectFormModal } from './components/ProjectFormModal';
import { LeadDetailDrawer } from './components/LeadDetailDrawer';
import { Login } from './views/Login';

const AdminViewRouter: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'projects' && <Projects />}
      {activeTab === 'properties' && <Properties />}
      {activeTab === 'leads' && <Leads />}
      {(activeTab === 'hotspot-simulator' || (activeTab as string) === 'plot-management') && <PlotManagement />}
      {activeTab === 'settings' && <Settings />}

      {/* Global Drawers & Modals for Admin Portal */}
      <PropertyDetailDrawer />
      <PropertyFormModal />
      <ProjectFormModal />
      <LeadDetailDrawer />
    </>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <AdminViewRouter />
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

