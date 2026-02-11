import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Pencil,
  DollarSign,
  RefreshCw,
  LogOut,
  Plus,
  User,
  Calendar,
  Menu,
  X,
  Star,
  CreditCard
} from 'lucide-react';
import logo from '../../assets/wildLogo.png';
import './Admin.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading, signout } = useAuth();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalPurchases: 0,
    totalRevenue: 0,
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminName, setAdminName] = useState('Admin');
  const [adminRole, setAdminRole] = useState('Administrator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check admin access - ONLY redirect if definitely not admin
  useEffect(() => {
    console.log('🔍 Dashboard auth check:', { 
      user: user?.email, 
      profile: profile?.role, 
      loading 
    });
    
    if (loading) {
      console.log('⏳ Still loading auth...');
      return;
    }
    
    if (!user) {
      console.log('❌ No user, redirecting to login');
      navigate('/admin', { replace: true });
      return;
    }
    
    if (!profile) {
      console.log('⏳ No profile loaded yet, waiting...');
      // Don't redirect yet - profile might still be loading
      return;
    }
    
    if (profile.role !== 'admin') {
      console.log('❌ Not admin role:', profile.role);
      alert('Access denied! Admin only.');
      navigate('/admin', { replace: true });
      return;
    }
    
    // Valid admin user
    console.log('✅ Valid admin access - fetching dashboard data');
    setAdminName(profile.full_name || 'Admin');
    setAdminRole('Administrator');
    fetchDashboardData();
  }, [user, profile, loading, navigate]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    setDashboardLoading(true);

    try {
      // Fetch users count
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      const totalUsers = usersError ? 0 : usersCount || 0;

      // Fetch products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      const totalProducts = productsError ? 0 : productsCount || 0;

      // Fetch orders count and revenue
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount');
      
      const totalPurchases = ordersError ? 0 : ordersData?.length || 0;
      
      let totalRevenue = 0;
      if (!ordersError && ordersData) {
        totalRevenue = ordersData.reduce((sum, order) => {
          return sum + (parseFloat(order.total_amount) || 0);
        }, 0);
      }

      setStats({
        totalUsers,
        totalProducts,
        totalPurchases,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }

    setDashboardLoading(false);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await signout();
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/admin', { replace: true });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading while checking authentication
  if (loading || !profile) {
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
          <p style={{ marginTop: '16px', color: '#8b7355', fontSize: '16px' }}>
            {loading ? 'Checking authentication...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Close button for mobile */}
        <button className="sidebar-close" onClick={closeSidebar}>
          <X size={24} />
        </button>

        <div className="sidebar-header">
          <img src={logo} alt="Wild Trail Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">My Wild Trail</h2>
        </div>
        
        <nav className="admin-nav">
          <button className="admin-nav-item active" onClick={() => { navigate('/admin/dashboard'); closeSidebar(); }}>
            <LayoutDashboard size={20} />
            <span>Admin Panel</span>
          </button>
          <button className="admin-nav-item" onClick={() => { navigate('/admin/users'); closeSidebar(); }}>
            <Users size={20} />
            <span>Users</span>
          </button>
          <button className="admin-nav-item" onClick={() => { navigate('/admin/products'); closeSidebar(); }}>
            <Package size={20} />
            <span>Products</span>
          </button>
          <button className="admin-nav-item" onClick={() => { navigate('/admin/purchases'); closeSidebar(); }}>
            <ShoppingCart size={20} />
            <span>Purchases</span>
          </button>
          <button className="admin-nav-item" onClick={() => { navigate('/admin/Addblog'); closeSidebar(); }}>
            <Pencil size={20} />
            <span>Add Blog</span>
          </button>
          <button className="admin-nav-item" onClick={() => { navigate('/admin/payment-status'); closeSidebar(); }}>
            <CreditCard size={20} />
            <span>Payment Status</span>
          </button>
          <button className="admin-nav-item" onClick={() => { navigate('/admin/reviews'); closeSidebar(); }}>
            <Star size={20} />
            <span>Reviews</span>
          </button>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Navigation Bar */}
        <div className="top-nav-bar">
          <div className="nav-left">
            {/* Hamburger Menu Button */}
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="nav-left-content">
              <div className="nav-left-header">
                <img src={logo} alt="Wild Trail Logo" className="top-nav-logo" />
                <h1 className="page-title">My Wild Trail Admin Panel</h1>
              </div>
              {/* Date Display */}
              <div className="time-display">
                <Calendar size={18} />
                <div className="time-info">
                  <span className="date">{formatDate()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="nav-right">
            {/* Admin Profile */}
            <div className="admin-profile">
              <div className="profile-avatar">
                <User size={20} />
              </div>
              <div className="profile-details">
                <span className="profile-name">{adminName}</span>
                <span className="profile-role">{adminRole}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="content-header">
            <div>
              <h2 className="content-title">Dashboard Overview</h2>
              <p className="content-subtitle">Welcome back! Here's what's happening today.</p>
            </div>
            <button className="refresh-btn" onClick={fetchDashboardData}>
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>

          {dashboardLoading ? (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card stat-card-blue">
                  <div className="stat-icon">
                    <Users size={32} />
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Total Users</p>
                    <h3>{stats.totalUsers}</h3>
                    <span className="stat-change positive">+12% from last month</span>
                  </div>
                </div>

                <div className="stat-card stat-card-purple">
                  <div className="stat-icon">
                    <Package size={32} />
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Total Products</p>
                    <h3>{stats.totalProducts}</h3>
                    <span className="stat-change positive">+8% from last month</span>
                  </div>
                </div>

                <div className="stat-card stat-card-orange">
                  <div className="stat-icon">
                    <ShoppingCart size={32} />
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Total Purchases</p>
                    <h3>{stats.totalPurchases}</h3>
                    <span className="stat-change positive">+23% from last month</span>
                  </div>
                </div>

                <div className="stat-card stat-card-green">
                  <div className="stat-icon">
                    <DollarSign size={32} />
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Total Revenue</p>
                    <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                    <span className="stat-change positive">+15% from last month</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button className="action-btn action-btn-primary" onClick={() => navigate('/admin/products')}>
                    <Plus size={20} />
                    <span>Add New Product</span>
                  </button>
                  <button className="action-btn action-btn-secondary" onClick={() => navigate('/admin/users')}>
                    <Users size={20} />
                    <span>View All Users</span>
                  </button>
                  <button className="action-btn action-btn-tertiary" onClick={() => navigate('/admin/purchases')}>
                    <ShoppingCart size={20} />
                    <span>View Purchases</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Simple Copyright Footer */}
        <div style={{
          padding: '20px 40px',
          textAlign: 'center',
          borderTop: '1px solid rgba(90, 74, 44, 0.1)',
          background: '#fafaf8',
          color: '#8b7355',
          fontSize: '14px',
          marginTop: 'auto'
        }}>
          <p style={{ margin: 0 }}>© 2026 Design by Royals Webtech</p>
        </div>
      </div>
    </div>
  );
}