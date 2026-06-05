import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Ticket, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      toast.error('Username dan password wajib diisi.');
      return;
    }
    setIsLoading(true);
    try {
      await login({ username: form.username.trim(), password: form.password });
      toast.success('Login berhasil! Selamat datang.');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login gagal. Periksa kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = 'w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 shadow-sm';

  return (
    <div className="min-h-screen bg-slate-100 dot-pattern flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Unierman Indah Lestarindo" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Unierman Indah Lestarindo</h1>
          <p className="text-slate-500 text-sm">Masuk ke Panel Administrasi</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username atau Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  name="username"
                  value={form.username}
                  onChange={set}
                  placeholder="admin"
                  autoComplete="username"
                  disabled={isLoading}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={show ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={set}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 mt-2"
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi...</>
                : 'Masuk ke Dashboard'
              }
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <Link to="/" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">
              ← Kembali ke Halaman Publik
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          Belum punya akun? Hubungi superadmin sistem.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
