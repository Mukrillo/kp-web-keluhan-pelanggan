const transporter = require('../config/mailer');

/**
 * Core send function — falls back to console.log if SMTP not configured
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    // Development fallback: log email to console
    console.log('\n' + '═'.repeat(60));
    console.log('📧  EMAIL LOG [Development Mode — No SMTP configured]');
    console.log('═'.repeat(60));
    console.log(`  To      : ${to}`);
    console.log(`  Subject : ${subject}`);
    console.log(`  Body    : [HTML — ${html.length} chars]`);
    console.log('═'.repeat(60) + '\n');
    return { success: true, mode: 'console' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"SimKeluhan" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to} [${info.messageId}]`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email send failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// ─── Email Templates ───────────────────────────────────────────────────────────

const ticketCreatedTemplate = (ticket) => ({
  to: ticket.email,
  subject: `[${ticket.ticketNumber}] Tiket Keluhan Anda Berhasil Dibuat`,
  html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body{font-family:Arial,sans-serif;background:#0f172a;margin:0;padding:24px}
    .wrap{max-width:580px;margin:0 auto;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155}
    .header{background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 28px;text-align:center;color:#fff}
    .header h1{margin:0;font-size:22px;font-weight:700}
    .header p{margin:8px 0 0;opacity:.85;font-size:14px}
    .body{padding:28px}
    .ticket-box{background:#0f172a;border:2px dashed #6366f1;border-radius:10px;padding:20px;text-align:center;margin:20px 0}
    .ticket-num{font-size:26px;font-weight:800;color:#818cf8;letter-spacing:2px;font-family:monospace}
    table{width:100%;border-collapse:collapse;margin:20px 0}
    td{padding:9px 0;border-bottom:1px solid #334155;font-size:13px;color:#94a3b8}
    td:first-child{font-weight:600;color:#64748b;width:40%}
    td:last-child{color:#e2e8f0}
    .status{display:inline-block;background:#1e40af22;color:#60a5fa;border:1px solid #3b82f620;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700}
    .footer{background:#0f172a;padding:18px;text-align:center;font-size:11px;color:#475569}
    a{color:#818cf8}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>🎫 Tiket Berhasil Dibuat!</h1>
      <p>Kami akan segera menangani keluhan Anda</p>
    </div>
    <div class="body">
      <p style="color:#cbd5e1;margin:0 0 4px">Yth. <strong style="color:#e2e8f0">${ticket.customerName}</strong>,</p>
      <p style="color:#94a3b8;font-size:14px">Tiket keluhan Anda telah diterima. Simpan nomor tiket ini untuk melacak status keluhan:</p>
      <div class="ticket-box">
        <p style="margin:0 0 6px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px">Nomor Tiket Anda</p>
        <div class="ticket-num">${ticket.ticketNumber}</div>
      </div>
      <table>
        <tr><td>Nama</td><td>${ticket.customerName}</td></tr>
        <tr><td>Email</td><td>${ticket.email}</td></tr>
        <tr><td>Telepon</td><td>${ticket.phone}</td></tr>
        ${ticket.resiNumber ? `<tr><td>No. Resi</td><td>${ticket.resiNumber}</td></tr>` : ''}
        <tr><td>Kategori</td><td>${ticket.category}</td></tr>
        <tr><td>Status</td><td><span class="status">OPEN</span></td></tr>
        <tr><td>Tanggal</td><td>${new Date(ticket.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</td></tr>
      </table>
      <p style="color:#94a3b8;font-size:13px">Lacak status tiket Anda di: <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/track?ticket=${ticket.ticketNumber}">${process.env.CLIENT_URL || 'http://localhost:5173'}/track</a></p>
    </div>
    <div class="footer">
      <p>Email ini dikirim otomatis. Jangan membalas email ini.</p>
      <p>© ${new Date().getFullYear()} Sistem Manajemen Keluhan Pelanggan</p>
    </div>
  </div>
</body>
</html>`,
});

const statusUpdateTemplate = (ticket) => ({
  to: ticket.email,
  subject: `[${ticket.ticketNumber}] Status Tiket Anda Telah Diperbarui — ${ticket.status}`,
  html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body{font-family:Arial,sans-serif;background:#0f172a;margin:0;padding:24px}
    .wrap{max-width:580px;margin:0 auto;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155}
    .header{background:linear-gradient(135deg,#059669,#10b981);padding:32px 28px;text-align:center;color:#fff}
    .header h1{margin:0;font-size:22px;font-weight:700}
    .body{padding:28px}
    .status-box{background:#0f172a;border-left:4px solid #10b981;border-radius:6px;padding:16px;margin:20px 0}
    .status-val{font-size:20px;font-weight:700;color:#34d399;margin:0 0 8px}
    .response{color:#94a3b8;font-size:14px;margin:8px 0 0;line-height:1.6}
    .footer{background:#0f172a;padding:18px;text-align:center;font-size:11px;color:#475569}
    a{color:#818cf8}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>📋 Status Tiket Diperbarui</h1>
    </div>
    <div class="body">
      <p style="color:#cbd5e1">Yth. <strong style="color:#e2e8f0">${ticket.customerName}</strong>,</p>
      <p style="color:#94a3b8;font-size:14px">Status tiket <strong style="color:#818cf8">${ticket.ticketNumber}</strong> telah diperbarui:</p>
      <div class="status-box">
        <p class="status-val">Status: ${ticket.status}</p>
        ${ticket.adminResponse ? `<p class="response">💬 Respons Admin:<br>${ticket.adminResponse}</p>` : ''}
      </div>
      <p style="color:#94a3b8;font-size:13px">Lihat detail tiket: <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/track?ticket=${ticket.ticketNumber}">Klik di sini</a></p>
    </div>
    <div class="footer">
      <p>Email ini dikirim otomatis. Jangan membalas email ini.</p>
      <p>© ${new Date().getFullYear()} Sistem Manajemen Keluhan Pelanggan</p>
    </div>
  </div>
</body>
</html>`,
});

module.exports = { sendEmail, ticketCreatedTemplate, statusUpdateTemplate };
