import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Pencil,
  LogOut,
  Menu,
  X,
  User,
  CreditCard,
  Star
} from 'lucide-react';
import logo from '../../assets/wildLogo.png';
import './Admin.css';

export default function AddBlogPage() {
  const navigate = useNavigate();
  const { user, profile, loading, signout } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    content: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!loading && (!user || !profile)) {
      console.log('❌ No valid session, redirecting to login');
      navigate('/admin');
    } else if (!loading && user && profile) {
      console.log('✅ Valid admin session:', profile.email);
    }
  }, [loading, user, profile, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Blog Data:', formData);
      setSuccessMessage('Blog post created successfully!');
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        category: '',
        content: '',
        image: null
      });
      setImagePreview(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    console.log('🚪 Logging out...');
    await signout();
    navigate('/admin');
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
        {/* Close button for mobile */}
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
          <button className="admin-nav-item active" onClick={() => { navigate('/admin/Addblog'); closeSidebar(); }}>
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
                <h1 className="page-title">Add New Blog Post</h1>
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
                <span className="profile-name">{profile?.full_name || 'Admin'}</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Form Content */}
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: '#faf8f5',
          padding: '40px 20px'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <p style={{
              color: '#8b7355',
              marginBottom: '32px'
            }}>
              Create and publish a new blog post for your website
            </p>

            {successMessage && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f5efe8',
                border: '1px solid #8b6f47',
                borderRadius: '8px',
                marginBottom: '24px',
                color: '#5c4033'
              }}>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#5c4033'
                }}>
                  Blog Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter blog title"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d4c4b0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b6f47'}
                  onBlur={(e) => e.target.style.borderColor = '#d4c4b0'}
                />
              </div>

              {/* Author */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#5c4033'
                }}>
                  Author Name *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter author name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d4c4b0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b6f47'}
                  onBlur={(e) => e.target.style.borderColor = '#d4c4b0'}
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#5c4033'
                }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d4c4b0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b6f47'}
                  onBlur={(e) => e.target.style.borderColor = '#d4c4b0'}
                >
                  <option value="">Select a category</option>
                  <option value="mammals">Mammals</option>
                  <option value="featured">Featured</option>
                  <option value="birds">Birds</option>
                  <option value="amphibian">Amphibian</option>
                  <option value="reptile">Reptile</option>
                  <option value="insects">Insects</option>
                  <option value="marine">Marine</option>
                </select>
              </div>

              {/* Featured Image */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#5c4033'
                }}>
                  Featured Image *
                </label>
                <div style={{
                  border: '2px dashed #d4c4b0',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#8b6f47';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d4c4b0';
                }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!imagePreview}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                    {imagePreview ? (
                      <div>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}
                        />
                        <p style={{ color: '#8b7355', fontSize: '14px' }}>
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div>
                        <svg 
                          style={{ 
                            width: '48px', 
                            height: '48px', 
                            margin: '0 auto 12px',
                            color: '#a89080'
                          }}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                          />
                        </svg>
                        <p style={{ color: '#5c4033', marginBottom: '4px' }}>
                          Click to upload or drag and drop
                        </p>
                        <p style={{ color: '#a89080', fontSize: '14px' }}>
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Content */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#5c4033'
                }}>
                  Blog Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  placeholder="Write your blog content here..."
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d4c4b0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b6f47'}
                  onBlur={(e) => e.target.style.borderColor = '#d4c4b0'}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      title: '',
                      author: '',
                      category: '',
                      content: '',
                      image: null
                    });
                    setImagePreview(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #8b6f47',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    color: '#5c4033',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5efe8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    backgroundColor: isSubmitting ? '#a89080' : '#5c4033',
                    color: 'white',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.target.style.backgroundColor = '#4a3329';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) e.target.style.backgroundColor = '#5c4033';
                  }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
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