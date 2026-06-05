import { useState, useRef } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

const ALLOWED_TYPES = {
  'image/jpeg': true, 'image/jpg': true, 'image/png': true, 'image/webp': true,
  'application/pdf': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
};

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const FileUpload = ({ onChange, className = '' }) => {
  const [file, setFile]       = useState(null);
  const [error, setError]     = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const validate = (f) => {
    if (!ALLOWED_TYPES[f.type])
      return 'Tipe file tidak diizinkan. Gunakan JPEG, PNG, WEBP, PDF, DOC, atau DOCX.';
    if (f.size > MAX_SIZE)
      return 'Ukuran file melebihi batas 5MB.';
    return null;
  };

  const handleFile = (f) => {
    const err = validate(f);
    if (err) { setError(err); setFile(null); onChange(null); }
    else      { setError('');  setFile(f);    onChange(f);    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleRemove = () => {
    setFile(null); setError(''); onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={className}>
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200 group
            ${dragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
            onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
          />
          <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${dragging ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`} />
          <p className="text-sm text-slate-500 mb-1">
            Drag &amp; drop atau{' '}
            <span className="text-blue-600 font-medium">pilih file</span>
          </p>
          <p className="text-xs text-slate-400">JPEG, PNG, WEBP, PDF, DOC, DOCX · Maks. 5MB</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            {file.type.startsWith('image/')
              ? <Image className="w-5 h-5 text-blue-500" />
              : <FileText className="w-5 h-5 text-blue-500" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-800 font-medium truncate">{file.name}</p>
            <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
