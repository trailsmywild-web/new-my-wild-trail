import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Pencil,
  Star,
  User,
  Calendar,
  CreditCard
} from 'lucide-react';
import logo from '../../assets/wildLogo.png';
import './Admin.css';

const AdminReview = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signout } = useAuth();
  
  const [reviews] = useState([
    {
      id: 1,
      user: "John Doe",
      message: "Amazing photography and quick delivery!",
      rating: 5,
    },
    {
      id: 2,
      user: "Priya Sharma",
      message: "Good quality but delivery was late.",
      rating: 4,
    },
    {
      id: 3,
      user: "Alexander Reed",
      message: "Amazing professionalism and stunning final results. The photos felt alive",
      rating: 4,
    },
    {
      id: 4,
      user: "Noah Williams",
      message: "Sharp, creative, and emotionally rich photographs. Worth every moment",
      rating: 3,
    },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Authentication check
  useEffect(() => {
    if (!loading && (!user || !profile)) {
      console.log('❌ No valid session, redirecting to login');
      navigate('/admin');
    } else if (!loading && user && profile) {
      console.log('✅ Valid admin session:', profile.email);
    }
  }, [loading, user, profile, navigate]);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    console.log('🚪 Logging out...');
    await signout();
    navigate('/admin');
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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < rating ? "#f59e0b" : "none"}
        stroke={index < rating ? "#f59e0b" : "#d1d5db"}
      />
    ));
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#faf8f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #5c4033',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#5c4033' }}>Loading...</p>
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
        <button className="sidebar-close" onClick={closeSidebar}>
          <X size={24} />
        </button>

        <div className="sidebar-header">
          <img src={logo} alt="Wild Trail Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">My Wild Trail</h2>
        </div>
        
        <nav className="admin-nav">
          <button className="admin-nav-item" onClick={() => { navigate('/admin/dashboard'); closeSidebar(); }}>
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
          <button className="admin-nav-item active" onClick={() => { navigate('/admin/reviews'); closeSidebar(); }}>
            <Star size={20} />
            <span>Review</span>
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
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="nav-left-content">
              <div className="nav-left-header">
                <img src={logo} alt="Wild Trail Logo" className="top-nav-logo" />
                <h1 className="page-title">My Wild Trail Admin Panel</h1>
              </div>
              <div className="time-display">
                <Calendar size={18} />
                <div className="time-info">
                  <span className="date">{formatDate()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="nav-right">
            <div className="admin-profile">
              <div className="profile-avatar">
                <User size={20} />
              </div>
              <div className="profile-details">
                <span className="profile-name">{profile?.full_name || 'Admin'}</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Content */}
        <div className="dashboard-content">
          <div className="content-header">
            <div>
              <h2 className="content-title">Customer Reviews</h2>
              <p className="content-subtitle">Manage and moderate customer feedback</p>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            {reviews.map((review) => (
              <div key={review.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.userName}>{review.user}</h3>
                  <div style={styles.starsContainer}>
                    {renderStars(review.rating)}
                    <span style={styles.ratingText}>{review.rating}/5</span>
                  </div>
                </div>
                <p style={styles.message}>{review.message}</p>

                <div style={styles.btnGroup}>
                  <button style={styles.approveBtn}>Approve</button>
                  <button style={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright Footer */}
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
};

const styles = {
  card: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid rgba(90, 74, 44, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  userName: {
    color: '#5a4a2c',
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  starsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  ratingText: {
    color: '#8b7355',
    fontSize: '14px',
    fontWeight: '500',
  },
  message: {
    color: '#6b5a42',
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  btnGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  approveBtn: {
    backgroundColor: '#6f4e37',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  deleteBtn: {
    backgroundColor: '#3e2723',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
};

export default AdminReview;