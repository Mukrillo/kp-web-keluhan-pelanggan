import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { FullPageSpinner } from './components/common/Spinner';
import PublicLayout from './layouts/PublicLayout';

// ─── Lazy-loaded Pages ─────────────────────────────────────────────────────────
const LandingPage       = lazy(() => import('./pages/public/LandingPage'));
const CreateTicketPage  = lazy(() => import('./pages/public/CreateTicketPage'));
const TrackTicketPage   = lazy(() => import('./pages/public/TrackTicketPage'));
const LoginPage         = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage     = lazy(() => import('./pages/admin/DashboardPage'));
const TicketListPage    = lazy(() => import('./pages/admin/TicketListPage'));
const ArchivedTicketsPage = lazy(() => import('./pages/admin/ArchivedTicketsPage'));
const TicketDetailPage  = lazy(() => import('./pages/admin/TicketDetailPage'));

// ─── Guards ────────────────────────────────────────────────────────────────────
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner label="Memverifikasi sesi..." />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
};

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner label="Memverifikasi sesi..." />;
  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
};

// ─── App ───────────────────────────────────────────────────────────────────────
const App = () => (
  <Suspense fallback={<FullPageSpinner />}>
    <Routes>
      {/* ── Public Routes ── */}
      <Route
        element={
          <PublicLayout>
            <Outlet />
          </PublicLayout>
        }
      >
        <Route path="/"            element={<LandingPage />} />
        <Route path="/buat-tiket"  element={<CreateTicketPage />} />
        <Route path="/track"       element={<TrackTicketPage />} />
      </Route>

      {/* ── Guest-only (redirect to dashboard if logged in) ── */}
      <Route element={<GuestRoute />}>
        <Route path="/admin/login" element={<LoginPage />} />
      </Route>

      {/* ── Protected Admin Routes ── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/tickets"   element={<TicketListPage />} />
        <Route path="/admin/archived"  element={<ArchivedTicketsPage />} />
        <Route path="/admin/tickets/:id" element={<TicketDetailPage />} />
      </Route>

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default App;
