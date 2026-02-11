import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext'; // ✅ USE AUTH CONTEXT
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  Package, 
  ShoppingCart,
  Pencil,
  LogOut,
  Search,
  Filter,
  Download,
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  Menu,
  X,
  Star,
  CreditCard
} from 'lucide-react';
import logo from '../../assets/wildLogo.png';
import './Admin.css';

export default function Users() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signout } = useAuth(); // ✅ USE AUTH CONTEXT
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ DON'T check localStorage - ProtectedRoute already handled auth
  // Just fetch users when component mounts
  useEffect(() => {
    if (!authLoading && user && profile) {
      console.log('✅ Users page - Valid admin, fetching users');
      fetchUsers();
    }
  }, [authLoading, user, profile]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching users via RPC function...');
      
      // Call the RPC function that bypasses RLS
      const { data, error } = await supabase.rpc('get_all_users_admin');
      
      if (error) {
        console.error('Supabase RPC error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('Fetched users successfully:', data);
      console.log('Number of users:', data?.length);
      
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to fetch users: ' + error.message);
      setUsers([]);
      setFilteredUsers([]);
    }
    setLoading(false);
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

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

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Created At'];
    const csvData = filteredUsers.map(user => [
      user.full_name || 'N/A',
      user.email || 'N/A',
      user.phone || 'N/A',
      user.role || 'customer',
      user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
          <button className="admin-nav-item active" onClick={() => { navigate('/admin/users'); closeSidebar(); }}>
            <UsersIcon size={20} />
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
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="nav-left-content">
              <div className="nav-left-header">
                <img src={logo} alt="Wild Trail Logo" className="top-nav-logo" />
                <h1 className="page-title">Users Management</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="content-header">
            <div>
              <h2 className="content-title">Users Management</h2>
              <p className="content-subtitle">Manage and view all registered users</p>
            </div>
            <button className="refresh-btn" onClick={exportToCSV}>
              <Download size={18} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Filters and Search */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'white',
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(90, 74, 44, 0.15)',
              flex: '1',
              minWidth: '300px',
              boxShadow: '0 2px 4px rgba(90, 74, 44, 0.05)'
            }}>
              <Search size={20} style={{ color: '#8b7355', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  width: '100%',
                  color: '#5a4a2c',
                  fontFamily: 'serif',
                  background: 'transparent'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'white',
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(90, 74, 44, 0.15)',
              boxShadow: '0 2px 4px rgba(90, 74, 44, 0.05)'
            }}>
              <Filter size={20} style={{ color: '#8b7355', flexShrink: 0 }} />
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: '#5a4a2c',
                  fontFamily: 'serif',
                  fontWeight: '500'
                }}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div style={{
              marginLeft: 'auto',
              color: '#8b7355',
              fontSize: '14px',
              fontWeight: '500',
              padding: '12px 0'
            }}>
              <p style={{ margin: 0 }}>Showing {filteredUsers.length} of {users.length} users</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid rgba(90, 74, 44, 0.1)',
              boxShadow: '0 2px 8px rgba(90, 74, 44, 0.08)'
            }}>
              <UsersIcon size={64} style={{ color: '#d4c9bb', marginBottom: '20px' }} />
              <h3 style={{
                fontSize: '24px',
                color: '#5a4a2c',
                margin: '0 0 12px 0',
                fontWeight: '600'
              }}>No users found</h3>
              <p style={{ color: '#8b7355', fontSize: '16px', margin: 0 }}>
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No users in the system yet'}
              </p>
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid rgba(90, 74, 44, 0.1)',
              boxShadow: '0 2px 8px rgba(90, 74, 44, 0.08)',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: 'serif'
                }}>
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(135deg, #5a4a2c 0%, #8b7355 100%)',
                      color: 'white'
                    }}>
                      <th style={{
                        padding: '18px 20px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid rgba(90, 74, 44, 0.2)'
                      }}>User</th>
                      <th style={{
                        padding: '18px 20px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid rgba(90, 74, 44, 0.2)'
                      }}>Email</th>
                      <th style={{
                        padding: '18px 20px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid rgba(90, 74, 44, 0.2)'
                      }}>Phone</th>
                      <th style={{
                        padding: '18px 20px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid rgba(90, 74, 44, 0.2)'
                      }}>Role</th>
                      <th style={{
                        padding: '18px 20px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '2px solid rgba(90, 74, 44, 0.2)'
                      }}>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} style={{
                        background: index % 2 === 0 ? '#fafaf8' : 'white',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f3ef';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? '#fafaf8' : 'white';
                      }}>
                        <td style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid rgba(90, 74, 44, 0.08)'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #8b7355 0%, #5a4a2c 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              flexShrink: 0
                            }}>
                              {user.role === 'admin' ? <Shield size={20} /> : <User size={20} />}
                            </div>
                            <div>
                              <div style={{
                                fontWeight: '600',
                                color: '#5a4a2c',
                                fontSize: '15px',
                                marginBottom: '2px'
                              }}>{user.full_name || 'N/A'}</div>
                              <div style={{
                                fontSize: '12px',
                                color: '#a89988',
                                fontFamily: 'monospace'
                              }}>ID: {user.id.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid rgba(90, 74, 44, 0.08)',
                          color: '#6b5d4f',
                          fontSize: '14px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={14} style={{ color: '#8b7355', flexShrink: 0 }} />
                            {user.email || 'N/A'}
                          </div>
                        </td>
                        <td style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid rgba(90, 74, 44, 0.08)',
                          color: '#6b5d4f',
                          fontSize: '14px'
                        }}>
                          {user.phone ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Phone size={14} style={{ color: '#8b7355', flexShrink: 0 }} />
                              {user.phone}
                            </div>
                          ) : (
                            <span style={{ color: '#a89988' }}>N/A</span>
                          )}
                        </td>
                        <td style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid rgba(90, 74, 44, 0.08)',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            background: user.role === 'admin' 
                              ? 'linear-gradient(135deg, #c4a574 0%, #a68a5a 100%)'
                              : 'linear-gradient(135deg, #7c9d96 0%, #5a8079 100%)',
                            color: 'white',
                            boxShadow: user.role === 'admin'
                              ? '0 2px 4px rgba(196, 165, 116, 0.3)'
                              : '0 2px 4px rgba(124, 157, 150, 0.3)',
                            display: 'inline-block'
                          }}>
                            {user.role || 'customer'}
                          </span>
                        </td>
                        <td style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid rgba(90, 74, 44, 0.08)',
                          color: '#6b5d4f',
                          fontSize: '14px'
                        }}>
                          {user.created_at ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Calendar size={14} style={{ color: '#8b7355', flexShrink: 0 }} />
                              {new Date(user.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          ) : (
                            <span style={{ color: '#a89988' }}>N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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