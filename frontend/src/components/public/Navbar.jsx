import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { to: '/',           label: 'Beranda'     },
  { to: '/buat-tiket', label: 'Buat Tiket'  },
  { to: '/track',      label: 'Lacak Tiket' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <img
            src="/logo.png"
            alt="Unierman Indah Lestarindo"
            className="h-9 w-auto object-contain"
          />
          <span className="text-slate-800 font-bold text-base hidden sm:block">Unierman Indah Lestarindo</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/admin/login"
            className="ml-3 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-md shadow-blue-500/20"
          >
            Admin
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg transition-colors hover:bg-slate-100"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-fade-in shadow-md">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50 transition-colors"
          >
            Admin Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
