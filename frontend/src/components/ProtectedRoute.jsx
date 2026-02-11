import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  console.log('🛡️ AdminRoute check:', { 
    path: location.pathname,
    user: user?.email, 
    profile: profile?.role, 
    loading 
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#fafaf8'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: '#8b7355', fontSize: '16px' }}>Checking access...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to admin login
  if (!user) {
    console.log('❌ No user - redirecting to /admin login');
    return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  }

  // Profile not loaded yet - show loading
  if (!profile) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#fafaf8'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: '#8b7355', fontSize: '16px' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Not an admin - redirect to admin login
  if (profile.role !== 'admin') {
    console.log('❌ Not admin - redirecting to /admin login');
    alert('Access denied! Admin credentials required.');
    return <Navigate to="/admin" replace />;
  }

  // Valid admin - allow access
  console.log('✅ Admin access granted');
  return children;
};

export const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};