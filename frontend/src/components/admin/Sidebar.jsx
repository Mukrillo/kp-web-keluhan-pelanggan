import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, Archive, LogOut, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/tickets',   icon: Ticket,          label: 'Tiket' },
  { to: '/admin/archived',  icon: Archive,          label: 'Arsip' },
];

const Sidebar = ({ collapsed = false, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
      toast.success('Berhasil logout.');
    } catch {
      toast.error('Logout gagal.');
    }
  };

  return (
    <aside
      className={`h-screen bg-blue-950/90 border-r border-blue-900/60 flex flex-col fixed left-0 top-0 z-30 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo + Toggle */}
      <div className={`border-b border-blue-900/50 flex items-center ${collapsed ? 'justify-center py-4 px-2' : 'justify-between px-4 py-4'}`}>
        {!collapsed && (
          <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm">
            <img
              src="/logo.png"
              alt="Unierman Indah Lestarindo"
              className="h-8 w-auto object-contain"
            />
          </div>
        )}
        <button
          onClick={onToggle}
          title={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
          className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <PanelLeftClose className="w-4 h-4" />
          }
        </button>
      </div>

      {/* Admin Panel label */}
      {!collapsed && (
        <p className="text-blue-400 text-xs font-medium px-5 pt-3 pb-1">Admin Panel</p>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) => `
              flex items-center gap-3 rounded-xl
              text-sm font-medium transition-all duration-150 group
              ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
              ${isActive
                ? 'bg-white/15 text-white border border-white/20'
                : 'text-blue-200 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className={`border-t border-blue-900/50 py-3 ${collapsed ? 'px-2' : 'px-3'}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.fullname?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate leading-tight">{user?.fullname}</p>
              <p className="text-blue-300 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-2.5 py-2 text-sm text-blue-200 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-150 ${collapsed ? 'justify-center px-2' : 'px-3'}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
