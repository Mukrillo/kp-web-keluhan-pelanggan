import { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import ErrorBoundary from '../components/common/ErrorBoundary';

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </div>
  );
};

export default AdminLayout;
