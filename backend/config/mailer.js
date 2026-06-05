const nodemailer = require('nodemailer');

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      '⚠️  SMTP credentials not configured. ' +
      'Emails will be logged to console (development mode). ' +
      'Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env to enable real sending.'
    );
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: SMTP_PORT === '465',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });

  // Verify connection
  transporter.verify((error) => {
    if (error) {
      console.error('❌ SMTP connection error:', error.message);
    } else {
      console.log(`✅ SMTP ready — host: ${SMTP_HOST}:${SMTP_PORT}`);
    }
  });

  return transporter;
};

const transporter = createTransporter();

module.exports = transporter;
