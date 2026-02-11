import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Package, DollarSign, TrendingUp, Users, Eye, Check, X, Filter, Download, Search, Menu as MenuIcon, LayoutDashboard, ShoppingCart, Pencil, LogOut, Star, CreditCard, User as UserIcon } from 'lucide-react';
import logo from '../../assets/wildLogo.png';
import './Purchases.css';
import './Admin.css';

const PurchaseManagement = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signout } = useAuth();
  const [selectedTab, setSelectedTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && user && profile) {
      console.log('✅ Purchases page - Valid admin');
    }
  }, [authLoading, user, profile]);

  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customerName: 'John Smith',
      email: 'john@email.com',
      items: [
        { photo: 'Golden Hour Lion', price: 45, quantity: 1 },
        { photo: 'Mountain Sunrise', price: 35, quantity: 2 }
      ],
      total: 115,
      status: 'pending',
      date: '2026-02-02',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-002',
      customerName: 'Sarah Johnson',
      email: 'sarah@email.com',
      items: [
        { photo: 'Elephant Family', price: 50, quantity: 1 }
      ],
      total: 50,
      status: 'completed',
      date: '2026-02-01',
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-003',
      customerName: 'Michael Brown',
      email: 'michael@email.com',
      items: [
        { photo: 'Majestic Eagle', price: 55, quantity: 1 },
        { photo: 'Wild Wolf', price: 60, quantity: 1 },
        { photo: 'Forest Stream', price: 40, quantity: 1 }
      ],
      total: 155,
      status: 'pending',
      date: '2026-02-02',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-004',
      customerName: 'Emily Davis',
      email: 'emily@email.com',
      items: [
        { photo: 'Autumn Leaves', price: 30, quantity: 3 }
      ],
      total: 90,
      status: 'completed',
      date: '2026-01-31',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-005',
      customerName: 'David Wilson',
      email: 'david@email.com',
      items: [
        { photo: 'Ocean Waves', price: 38, quantity: 2 },
        { photo: 'Sunset Desert', price: 48, quantity: 1 }
      ],
      total: 124,
      status: 'cancelled',
      date: '2026-02-01',
      paymentMethod: 'PayPal'
    }
  ]);

  // Sample photo inventory
  const [photoInventory] = useState([
    { id: 1, title: 'Golden Hour Lion', category: 'animals', price: 45, sales: 15, revenue: 675, status: 'active' },
    { id: 2, title: 'Mountain Sunrise', category: 'nature', price: 35, sales: 23, revenue: 805, status: 'active' },
    { id: 3, title: 'Elephant Family', category: 'animals', price: 50, sales: 18, revenue: 900, status: 'active' },
    { id: 4, title: 'Forest Stream', category: 'nature', price: 40, sales: 12, revenue: 480, status: 'active' },
    { id: 5, title: 'Majestic Eagle', category: 'animals', price: 55, sales: 20, revenue: 1100, status: 'active' },
    { id: 6, title: 'Autumn Leaves', category: 'nature', price: 30, sales: 28, revenue: 840, status: 'active' },
    { id: 7, title: 'Wild Wolf', category: 'animals', price: 60, sales: 16, revenue: 960, status: 'active' },
    { id: 8, title: 'Ocean Waves', category: 'nature', price: 38, sales: 14, revenue: 532, status: 'active' }
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signout();
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/admin', { replace: true });
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Statistics
  const totalRevenue = orders.reduce((sum, order) => 
    order.status !== 'cancelled' ? sum + order.total : sum, 0
  );
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#d97706';
      case 'completed': return '#059669';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'pending': return '#fef3c7';
      case 'completed': return '#d1fae5';
      case 'cancelled': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  if (authLoading) {
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
          <p style={{ marginTop: '16px', color: '#8b7355', fontSize: '16px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-dashboard">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

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
          <button className="admin-nav-item active" onClick={() => { navigate('/admin/purchases'); closeSidebar(); }}>
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
            <span>Review</span>
          </button>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <div className="admin-main">
        <div className="top-nav-bar">
          <div className="nav-left">
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <MenuIcon size={24} />
            </button>
            <div className="nav-left-content">
              <div className="nav-left-header">
                <img src={logo} alt="Wild Trail Logo" className="top-nav-logo" />
                <h1 className="page-title">Purchase Management</h1>
              </div>
            </div>
          </div>

          <div className="nav-right">
            <div className="admin-profile">
              <div className="profile-avatar">
                <UserIcon size={20} />
              </div>
              <div className="profile-details">
                <span className="profile-name">{profile?.full_name || 'Admin'}</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </div>

        <div className="purchase-content">
          {/* Statistics Cards */}
          <div className="stats-grid">
            {[
              { icon: DollarSign, label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: '#059669' },
              { icon: Package, label: 'Total Orders', value: totalOrders, color: '#3b82f6' },
              { icon: TrendingUp, label: 'Pending Orders', value: pendingOrders, color: '#d97706' },
              { icon: Check, label: 'Completed', value: completedOrders, color: '#059669' }
            ].map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-card-inner">
                  <div className="stat-icon-wrapper" style={{ background: `${stat.color}15` }}>
                    <stat.icon size={28} color={stat.color} />
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">{stat.label}</p>
                    <h3 className="stat-value">{stat.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            {[
              { id: 'orders', label: 'Order Management', icon: Package },
              { id: 'inventory', label: 'Photo Inventory', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`tab-button ${selectedTab === tab.id ? 'tab-active' : ''}`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {selectedTab === 'orders' && (
            <div className="content-card">
              {/* Filters */}
              <div className="filters-wrapper">
                <div className="search-wrapper">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="filter-buttons">
                  {['all', 'pending', 'completed', 'cancelled'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setOrderFilter(filter)}
                      className={`filter-btn ${orderFilter === filter ? 'filter-active' : ''}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="table-container">
                <div className="table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="no-data">
                            <Package size={48} />
                            <p>No orders found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="order-id">{order.id}</td>
                            <td>
                              <div className="customer-info">
                                <div className="customer-name">{order.customerName}</div>
                                <div className="customer-email">{order.email}</div>
                              </div>
                            </td>
                            <td>
                              <div className="items-list">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="item-row">
                                    <span className="item-name">{item.photo}</span>
                                    <span className="item-qty">x{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="order-total">${order.total.toFixed(2)}</td>
                            <td className="order-date">{order.date}</td>
                            <td className="payment-method">{order.paymentMethod}</td>
                            <td>
                              <span 
                                className="status-badge"
                                style={{
                                  background: getStatusBg(order.status),
                                  color: getStatusColor(order.status)
                                }}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td>
                              {order.status === 'pending' ? (
                                <div className="action-buttons">
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    className="action-btn complete-btn"
                                    title="Mark Complete"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    className="action-btn cancel-btn"
                                    title="Cancel"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ) : (
                                <span className="no-action">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {selectedTab === 'inventory' && (
            <div className="content-card">
              <h2 className="inventory-title">Photo Inventory & Performance</h2>

              <div className="inventory-grid">
                {photoInventory.map((photo) => (
                  <div key={photo.id} className="inventory-card">
                    <h3 className="photo-title">{photo.title}</h3>
                    <span className="photo-category">{photo.category}</span>

                    <div className="photo-stats">
                      <div className="stat-item">
                        <p className="stat-item-label">Price</p>
                        <p className="stat-item-value">${photo.price}</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-item-label">Sales</p>
                        <p className="stat-item-value">{photo.sales}</p>
                      </div>
                    </div>

                    <div className="photo-revenue">
                      <p className="revenue-label">Total Revenue</p>
                      <p className="revenue-value">${photo.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="footer-copyright">
          <p>© 2026 Design by Royals Webtech</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Crimson+Pro:wght@400;600;700&display=swap');
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #5c4033;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default PurchaseManagement;