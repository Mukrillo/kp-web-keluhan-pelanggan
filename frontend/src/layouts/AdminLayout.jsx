import { useState, useEffect } from 'react';
import Sidebar from '../components/admin/Sidebar';
import ErrorBoundary from '../components/common/ErrorBoundary';

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleToggle = () => setCollapsed((c) => !c);
    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex relative">
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${collapsed ? 'md:ml-16 ml-0' : 'md:ml-64 ml-0'}`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </div>
  );
};

export default AdminLayout;
