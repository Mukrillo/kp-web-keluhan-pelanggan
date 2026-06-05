import { useState } from 'react';
import { Send, User, Mail, Phone, Hash, Tag, FileText } from 'lucide-react';
import { ticketService } from '../../services/ticket.service';
import { TICKET_CATEGORIES } from '../../utils/constants';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const Field = ({ label, icon: Icon, error, required, children, className = '' }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />}
      {children}
    </div>
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

const inputCls = (hasIcon, error) =>
  `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-white border rounded-lg
   text-slate-800 placeholder:text-slate-400 text-sm
   focus:outline-none focus:ring-1 transition-all duration-200 shadow-sm
   ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'}`;

const TicketForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    customerName: '', email: '', phone: '',
    resiNumber: '', category: '', description: '',
  });
  const [file, setFile]       = useState(null);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Nama wajib diisi.';
    if (!form.email.trim())        e.email = 'Email wajib diisi.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Format email tidak valid.';
    if (!form.phone.trim())        e.phone = 'Nomor telepon wajib diisi.';
    if (!form.category)            e.category = 'Kategori wajib dipilih.';
    if (!form.description.trim())  e.description = 'Deskripsi wajib diisi.';
    else if (form.description.trim().length < 20) e.description = 'Deskripsi minimal 20 karakter.';
    return e;
  };

  const set = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (file) fd.append('attachment', file);
      const data = await ticketService.createTicket(fd);
      onSuccess(data);
    } catch (err) {
      toast.error(err.message || 'Gagal membuat tiket. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nama Lengkap" icon={User} error={errors.customerName} required>
          <input name="customerName" value={form.customerName} onChange={set}
            placeholder="Masukkan nama lengkap" className={inputCls(true, errors.customerName)} />
        </Field>
        <Field label="Email" icon={Mail} error={errors.email} required>
          <input type="email" name="email" value={form.email} onChange={set}
            placeholder="email@contoh.com" className={inputCls(true, errors.email)} />
        </Field>
        <Field label="Nomor Telepon" icon={Phone} error={errors.phone} required>
          <input type="tel" name="phone" value={form.phone} onChange={set}
            placeholder="08xxxxxxxxxx" className={inputCls(true, errors.phone)} />
        </Field>
        <Field label="Nomor Resi (Opsional)" icon={Hash}>
          <input name="resiNumber" value={form.resiNumber} onChange={set}
            placeholder="Opsional" className={inputCls(true, false)} />
        </Field>
      </div>

      <Field label="Kategori Keluhan" icon={Tag} error={errors.category} required>
        <select name="category" value={form.category} onChange={set}
          className={`${inputCls(true, errors.category)} appearance-none cursor-pointer`}>
          <option value="" disabled>Pilih kategori...</option>
          {TICKET_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Deskripsi Keluhan <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <textarea
            name="description" value={form.description} onChange={set} rows={5}
            placeholder="Jelaskan keluhan Anda secara detail (minimal 20 karakter)..."
            className={`${inputCls(true, errors.description)} resize-none leading-relaxed`}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span>{errors.description && <p className="text-xs text-red-400">{errors.description}</p>}</span>
          <span className={`text-xs ${form.description.length < 20 ? 'text-slate-600' : 'text-slate-500'}`}>
            {form.description.length}/2000
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Lampiran <span className="text-slate-400 font-normal">(Opsional)</span>
        </label>
        <FileUpload onChange={setFile} />
      </div>

      <Button type="submit" variant="primary" size="lg" isLoading={loading} icon={Send} className="w-full">
        {loading ? 'Mengirim...' : 'Kirim Tiket'}
      </Button>
    </form>
  );
};

export default TicketForm;
