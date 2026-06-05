import Navbar from '../components/public/Navbar';
import ErrorBoundary from '../components/common/ErrorBoundary';

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main className="pt-16">
      <ErrorBoundary>{children}</ErrorBoundary>
    </main>
  </div>
);

export default PublicLayout;
