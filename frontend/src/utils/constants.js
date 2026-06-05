export const TICKET_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const TICKET_STATUS_LABELS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export const TICKET_STATUS_OPTIONS = [
  { value: 'OPEN',        label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED',    label: 'Resolved' },
  { value: 'CLOSED',      label: 'Closed' },
];

export const TICKET_CATEGORIES = [
  { value: 'PENGIRIMAN', label: 'Pengiriman' },
  { value: 'PEMBAYARAN', label: 'Pembayaran' },
  { value: 'PRODUK',     label: 'Produk' },
  { value: 'LAYANAN',    label: 'Layanan' },
  { value: 'LAINNYA',    label: 'Lainnya' },
];

export const CATEGORY_LABELS = {
  PENGIRIMAN: 'Pengiriman',
  PEMBAYARAN: 'Pembayaran',
  PRODUK:     'Produk',
  LAYANAN:    'Layanan',
  LAINNYA:    'Lainnya',
};

export const AUDIT_ACTION_LABELS = {
  CREATED:        'Tiket Dibuat',
  STATUS_CHANGE:  'Status Diubah',
  ARCHIVE:        'Diarsipkan',
  RESTORE:        'Dipulihkan dari Arsip',
  RESPONSE_ADDED: 'Respon Admin Ditambahkan',
};
