import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import Dashboard from './sections/Dashboard';
import Products from './sections/Products';
import Orders from './sections/Orders';
import Customers from './sections/Customers';
import Content from './sections/Content';
import Marketing from './sections/Marketing';
import Settings from './sections/Settings';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'content':
        return <Content />;
      case 'marketing':
        return <Marketing />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      onLogout={onLogout}
    >
      {renderSection()}
    </AdminLayout>
  );
};

export default AdminPanel;
