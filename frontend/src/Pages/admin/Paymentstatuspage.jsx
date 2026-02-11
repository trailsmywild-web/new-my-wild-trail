import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // ✅ USE AUTH CONTEXT
import { 
  Search, 
  Download, 
  RefreshCw, 
  ChevronDown, 
  MapPin, 
  DollarSign, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Pencil,
  Star,
  CreditCard,
  LogOut,
  Menu,
  X,
  User,
  Calendar
} from 'lucide-react';
import logo from '../../assets/wildLogo.png';
import './Admin.css';
import './Paymentstatuspage.css';

const Paymentstatuspage = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signout } = useAuth(); // ✅ USE AUTH CONTEXT
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ DON'T check localStorage - ProtectedRoute already handled auth
  useEffect(() => {
    if (!authLoading && user && profile) {
      console.log('✅ Payment Status page - Valid admin');
    }
  }, [authLoading, user, profile]);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // ✅ USE signout FROM AUTH CONTEXT
  const handleLogout = async () => {
    try {
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

  // Currency symbols based on location
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CNY': '¥'
  };

  // Sample payment data with location-based currencies
  const samplePayments = [
    { 
      id: 'PAY001', 
      customer: 'John Doe', 
      email: 'john@example.com', 
      amount: 1250.00, 
      currency: 'USD', 
      location: 'United States', 
      status: 'completed', 
      method: 'Credit Card', 
      date: '2026-02-06T10:30:00', 
      gateway: 'Stripe', 
      transactionId: 'TXN123456' 
    },
    { 
      id: 'PAY002', 
      customer: 'Emma Wilson', 
      email: 'emma@example.com', 
      amount: 850.00, 
      currency: 'EUR', 
      location: 'Germany', 
      status: 'pending', 
      method: 'PayPal', 
      date: '2026-02-06T09:15:00', 
      gateway: 'PayPal', 
      transactionId: 'TXN123457' 
    },
    { 
      id: 'PAY003', 
      customer: 'Raj Kumar', 
      email: 'raj@example.com', 
      amount: 45000.00, 
      currency: 'INR', 
      location: 'India', 
      status: 'completed', 
      method: 'UPI', 
      date: '2026-02-05T16:45:00', 
      gateway: 'Razorpay', 
      transactionId: 'TXN123458' 
    },
    { 
      id: 'PAY004', 
      customer: 'Sophie Martin', 
      email: 'sophie@example.com', 
      amount: 2100.00, 
      currency: 'GBP', 
      location: 'United Kingdom', 
      status: 'failed', 
      method: 'Debit Card', 
      date: '2026-02-05T14:20:00', 
      gateway: 'Stripe', 
      transactionId: 'TXN123459' 
    },
    { 
      id: 'PAY005', 
      customer: 'Michael Chen', 
      email: 'michael@example.com', 
      amount: 15000.00, 
      currency: 'CNY', 
      location: 'China', 
      status: 'completed', 
      method: 'WeChat Pay', 
      date: '2026-02-04T11:30:00', 
      gateway: 'Alipay', 
      transactionId: 'TXN123460' 
    },
    { 
      id: 'PAY006', 
      customer: 'Sarah Johnson', 
      email: 'sarah@example.com', 
      amount: 3200.00, 
      currency: 'AUD', 
      location: 'Australia', 
      status: 'refunded', 
      method: 'Credit Card', 
      date: '2026-02-04T08:00:00', 
      gateway: 'Stripe', 
      transactionId: 'TXN123461' 
    },
    { 
      id: 'PAY007', 
      customer: 'David Brown', 
      email: 'david@example.com', 
      amount: 950.00, 
      currency: 'USD', 
      location: 'United States', 
      status: 'pending', 
      method: 'Bank Transfer', 
      date: '2026-02-03T15:30:00', 
      gateway: 'Stripe', 
      transactionId: 'TXN123462' 
    },
    { 
      id: 'PAY008', 
      customer: 'Lisa Anderson', 
      email: 'lisa@example.com', 
      amount: 1800.00, 
      currency: 'CAD', 
      location: 'Canada', 
      status: 'completed', 
      method: 'Credit Card', 
      date: '2026-02-03T12:00:00', 
      gateway: 'Square', 
      transactionId: 'TXN123463' 
    },
    { 
      id: 'PAY009', 
      customer: 'Yuki Tanaka', 
      email: 'yuki@example.com', 
      amount: 125000.00, 
      currency: 'JPY', 
      location: 'Japan', 
      status: 'completed', 
      method: 'Credit Card', 
      date: '2026-02-02T10:15:00', 
      gateway: 'Stripe', 
      transactionId: 'TXN123464' 
    },
    { 
      id: 'PAY010', 
      customer: 'Marco Rossi', 
      email: 'marco@example.com', 
      amount: 680.00, 
      currency: 'EUR', 
      location: 'Italy', 
      status: 'failed', 
      method: 'PayPal', 
      date: '2026-02-02T09:00:00', 
      gateway: 'PayPal', 
      transactionId: 'TXN123465' 
    },
  ];

  useEffect(() => {
    setPayments(samplePayments);
    setFilteredPayments(samplePayments);
  }, []);

  // Statistics calculation
  const stats = {
    total: filteredPayments.length,
    completed: filteredPayments.filter(p => p.status === 'completed').length,
    pending: filteredPayments.filter(p => p.status === 'pending').length,
    failed: filteredPayments.filter(p => p.status === 'failed').length,
    totalRevenue: filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  // Filter and search logic
  useEffect(() => {
    let result = payments;

    if (searchTerm) {
      result = result.filter(p => 
        p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (currencyFilter !== 'all') {
      result = result.filter(p => p.currency === currencyFilter);
    }

    const now = new Date();
    if (dateRange !== 'all') {
      result = result.filter(p => {
        const paymentDate = new Date(p.date);
        const diffDays = Math.floor((now - paymentDate) / (1000 * 60 * 60 * 24));
        
        switch(dateRange) {
          case 'today': return diffDays === 0;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          default: return true;
        }
      });
    }

    result.sort((a, b) => {
      switch(sortBy) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc': return a.amount - b.amount;
        default: return 0;
      }
    });

    setFilteredPayments(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, currencyFilter, dateRange, sortBy, payments]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="status-icon" />;
      case 'pending': return <Clock className="status-icon" />;
      case 'failed': return <XCircle className="status-icon" />;
      case 'refunded': return <AlertCircle className="status-icon" />;
      default: return null;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      default: return 'status-default';
    }
  };

  const formatCurrency = (amount, currency) => {
    return `${currencySymbols[currency]}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Customer', 'Email', 'Amount', 'Currency', 'Location', 'Status', 'Method', 'Date'];
    const csvData = filteredPayments.map(p => [
      p.id, p.customer, p.email, p.amount, p.currency, p.location, p.status, p.method, p.date
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString()}.csv`;
    a.click();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrencyFilter('all');
    setDateRange('all');
    setSortBy('date-desc');
  };

  // Show loading while auth is loading
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
          <button className="admin-nav-item active" onClick={() => { navigate('/admin/payment-status'); closeSidebar(); }}>
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

        {/* Payment Dashboard Content */}
        <div className="dashboard-content">
          <div className="content-header" style={{ marginBottom: '30px' }}>
            <div>
              <h2 className="content-title">Payment Gateway Dashboard</h2>
              <p className="content-subtitle">Monitor and manage your global payment transactions</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid" style={{ marginBottom: '30px' }}>
            <div className="stat-card stat-card-blue">
              <div className="stat-icon">
                <DollarSign size={32} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Transactions</p>
                <h3>{stats.total}</h3>
              </div>
            </div>

            <div className="stat-card stat-card-green">
              <div className="stat-icon">
                <CheckCircle size={32} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Completed</p>
                <h3>{stats.completed}</h3>
              </div>
            </div>

            <div className="stat-card stat-card-orange">
              <div className="stat-icon">
                <Clock size={32} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Pending</p>
                <h3>{stats.pending}</h3>
              </div>
            </div>

            <div className="stat-card stat-card-red">
              <div className="stat-icon">
                <XCircle size={32} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Failed</p>
                <h3>{stats.failed}</h3>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="filters-container">
            <div className="filters-grid">
              {/* Search */}
              <div className="filter-item filter-search">
                <label className="filter-label">Search</label>
                <div className="input-wrapper">
                  <Search className="input-icon" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="filter-item">
                <label className="filter-label">Status</label>
                <div className="select-wrapper">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select-field"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
              </div>

              {/* Currency Filter */}
              <div className="filter-item">
                <label className="filter-label">Currency</label>
                <div className="select-wrapper">
                  <select
                    value={currencyFilter}
                    onChange={(e) => setCurrencyFilter(e.target.value)}
                    className="select-field"
                  >
                    <option value="all">All Currencies</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="CNY">CNY - Chinese Yuan</option>
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
              </div>

              {/* Date Range */}
              <div className="filter-item">
                <label className="filter-label">Date Range</label>
                <div className="select-wrapper">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="select-field"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
              </div>

              {/* Sort By */}
              <div className="filter-item">
                <label className="filter-label">Sort By</label>
                <div className="select-wrapper">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="select-field"
                  >
                    <option value="date-desc">Latest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Highest Amount</option>
                    <option value="amount-asc">Lowest Amount</option>
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons" style={{ marginTop: '20px' }}>
              <button onClick={exportToCSV} className="action-btn action-btn-primary">
                <Download size={18} />
                <span>Export CSV</span>
              </button>
              <button onClick={resetFilters} className="action-btn action-btn-secondary">
                <RefreshCw size={18} />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="table-container" style={{ marginTop: '30px' }}>
            <div className="table-wrapper">
              <table className="payments-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header">Transaction ID</th>
                    <th className="table-header">Customer</th>
                    <th className="table-header">Location</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Payment Method</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {currentItems.map((payment) => (
                    <tr key={payment.id} className="table-row">
                      <td className="table-cell">
                        <div className="cell-primary">{payment.id}</div>
                        <div className="cell-secondary">{payment.transactionId}</div>
                      </td>
                      <td className="table-cell">
                        <div className="cell-primary">{payment.customer}</div>
                        <div className="cell-secondary">{payment.email}</div>
                      </td>
                      <td className="table-cell">
                        <div className="location-cell">
                          <MapPin className="location-icon" />
                          <span className="cell-primary">{payment.location}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="cell-primary cell-amount">{formatCurrency(payment.amount, payment.currency)}</div>
                        <div className="cell-secondary">{payment.currency}</div>
                      </td>
                      <td className="table-cell">
                        <div className="cell-primary">{payment.method}</div>
                        <div className="cell-secondary">{payment.gateway}</div>
                      </td>
                      <td className="table-cell">
                        <span className={`status-badge ${getStatusClass(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="cell-primary">
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                        <div className="cell-secondary">
                          {new Date(payment.date).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowDetails(true);
                          }}
                          className="action-btn action-btn-tertiary"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination-wrapper">
                <div className="pagination-info">
                  <span className="pagination-label">Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="pagination-select"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div className="pagination-stats">
                  <span className="pagination-label">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length} results
                  </span>
                </div>

                <div className="pagination-controls">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn-pagination"
                  >
                    Previous
                  </button>
                  <div className="pagination-pages">
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`btn-page ${currentPage === pageNum ? 'btn-page-active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn-pagination"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
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

      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Payment Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="modal-close"
              >
                <XCircle className="modal-close-icon" />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-grid">
                <div className="modal-field">
                  <label className="modal-label">Transaction ID</label>
                  <p className="modal-value">{selectedPayment.id}</p>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Gateway Transaction ID</label>
                  <p className="modal-value">{selectedPayment.transactionId}</p>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Customer Name</label>
                  <p className="modal-value">{selectedPayment.customer}</p>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Email Address</label>
                  <p className="modal-value">{selectedPayment.email}</p>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Amount</label>
                  <p className="modal-value modal-amount">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </p>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Currency</label>
                  <p className="modal-value">{selectedPayment.currency}</p>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Location</label>
                  <div className="modal-location">
                    <MapPin className="location-icon" />
                    {selectedPayment.location}
                  </div>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Status</label>
                  <span className={`status-badge ${getStatusClass(selectedPayment.status)}`}>
                    {getStatusIcon(selectedPayment.status)}
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Payment Method</label>
                  <p className="modal-value">{selectedPayment.method}</p>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Payment Gateway</label>
                  <p className="modal-value">{selectedPayment.gateway}</p>
                </div>
                <div className="modal-field modal-field-full">
                  <label className="modal-label">Transaction Date & Time</label>
                  <p className="modal-value">
                    {new Date(selectedPayment.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button className="action-btn action-btn-primary" style={{ flex: 1 }}>
                  Send Receipt
                </button>
                <button className="action-btn action-btn-secondary" style={{ flex: 1 }}>
                  Refund Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Paymentstatuspage;