import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './app.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          gutter={8}
          containerStyle={{ zIndex: 9999 }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '10px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#1e293b' },
              style: {
                background: '#1e293b',
                border: '1px solid #064e3b30',
              },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#1e293b' },
              style: {
                background: '#1e293b',
                border: '1px solid #7f1d1d30',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
