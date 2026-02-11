import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI, uploadAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, Package, ShoppingCart, LogOut, Search, Filter, Plus, Edit2, Trash2, X, Upload, DollarSign, Tag, FileText, Image as ImageIcon, Menu } from 'lucide-react';
import logo from '../../assets/wildLogo.png';
import './Admin.css';

export default function Products() {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = ['all', 'featured', 'mammals', 'birds', 'marine', 'amphibian', 'reptiles', 'insects'];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'mammals',
    image: null,
    imageUrl: ''
  });

  // Check admin access
  useEffect(() => {
    if (profile) {
      if (profile.role === 'admin') {
        setAdminChecked(true);
        fetchProducts();
      } else {
        alert('Access denied! Admin only.');
        navigate('/');
      }
    }
  }, [profile, navigate]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data || []);
      setFilteredProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('Failed to fetch products: ' + error.message);
      setProducts([]);
      setFilteredProducts([]);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPEG, PNG, and WebP images are allowed');
        return;
      }

      setFormData({ ...formData, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'mammals',
      image: null,
      imageUrl: ''
    });
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.name || '',
      description: product.description || '',
      price: product.price ? `$${product.price}` : '',
      category: product.category || 'mammals',
      image: null,
      imageUrl: product.image_url || ''
    });
    setImagePreview(product.image_url || null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    // If adding new product, image is required
    if (!editingProduct && !formData.image) {
      alert('Please upload an image');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (formData.image) {
        setUploadingImage(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadProduct(formData.image);
          imageUrl = uploadResponse.data.url;
          setUploadingImage(false);
        } catch (error) {
          alert('Failed to upload image: ' + error.message);
          setUploadingImage(false);
          setLoading(false);
          return;
        }
      }

      // Parse price - remove $ sign if present
      const priceValue = formData.price.toString().replace('$', '').trim();
      const parsedPrice = parseFloat(priceValue);

      if (isNaN(parsedPrice)) {
        alert('Please enter a valid price');
        setLoading(false);
        return;
      }

      const productData = {
        name: formData.title,
        description: formData.description,
        price: parsedPrice,
        category_id: null, // You can add category mapping later
        stock: 100,
        image_url: imageUrl,
        is_featured: formData.category === 'featured',
        category: formData.category // Store as text for now
      };

      if (editingProduct) {
        // Update existing product
        await productsAPI.update(editingProduct.id, productData);
        alert('Product updated successfully!');
      } else {
        // Add new product
        await productsAPI.create(productData);
        alert('Product added successfully!');
      }
      
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    }

    setLoading(false);
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      setLoading(true);
      
      try {
        await productsAPI.delete(productId);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product: ' + (error.response?.data?.error || error.message));
      }
      
      setLoading(false);
    }
  };

  if (!adminChecked) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Checking access...</p>
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
          <button className="admin-nav-item active" onClick={() => { navigate('/admin/products'); closeSidebar(); }}>
            <Package size={20} />
            <span>Products</span>
          </button>
          <button className="admin-nav-item" onClick={() => { navigate('/admin/purchases'); closeSidebar(); }}>
            <ShoppingCart size={20} />
            <span>Purchases</span>
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
            <img src={logo} alt="Wild Trail Logo" className="top-nav-logo" />
            <h1 className="page-title">Products Management</h1>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="content-header">
            <div>
              <h2 className="content-title">Products Management</h2>
              <p className="content-subtitle">Manage your wildlife photography collection</p>
            </div>
            <button className="refresh-btn" onClick={openAddModal}>
              <Plus size={18} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Filters and Search */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '12px 18px', borderRadius: '10px', border: '1px solid rgba(90, 74, 44, 0.15)', flex: '1', minWidth: '300px', boxShadow: '0 2px 4px rgba(90, 74, 44, 0.05)' }}>
              <Search size={20} style={{ color: '#8b7355', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '15px', width: '100%', color: '#5a4a2c', fontFamily: 'serif', background: 'transparent' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '12px 18px', borderRadius: '10px', border: '1px solid rgba(90, 74, 44, 0.15)', boxShadow: '0 2px 4px rgba(90, 74, 44, 0.05)' }}>
              <Filter size={20} style={{ color: '#8b7355', flexShrink: 0 }} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '15px', cursor: 'pointer', background: 'transparent', color: '#5a4a2c', fontFamily: 'serif', fontWeight: '500' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginLeft: 'auto', color: '#8b7355', fontSize: '14px', fontWeight: '500', padding: '12px 0' }}>
              <p style={{ margin: 0 }}>Showing {filteredProducts.length} of {products.length} products</p>
            </div>
          </div>

          {/* Products Table */}
          {loading && !showModal ? (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '12px', border: '1px solid rgba(90, 74, 44, 0.1)', boxShadow: '0 2px 8px rgba(90, 74, 44, 0.08)' }}>
              <Package size={64} style={{ color: '#d4c9bb', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '24px', color: '#5a4a2c', margin: '0 0 12px 0', fontWeight: '600' }}>No products found</h3>
              <p style={{ color: '#8b7355', fontSize: '16px', margin: 0 }}>
                Try adjusting your search or add a new product
              </p>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(90, 74, 44, 0.1)', boxShadow: '0 2px 8px rgba(90, 74, 44, 0.08)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'serif' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #5a4a2c 0%, #8b7355 100%)', color: 'white' }}>
                      <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Image</th>
                      <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Details</th>
                      <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
                      <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                      <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        style={{ background: index % 2 === 0 ? '#fafaf8' : 'white', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3ef'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = index % 2 === 0 ? '#fafaf8' : 'white'; }}
                      >
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid rgba(90, 74, 44, 0.08)' }}>
                          <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '2px solid rgba(90, 74, 44, 0.1)', position: 'relative' }}>
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: '#e8e6e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b7355' }}>
                                <ImageIcon size={32} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid rgba(90, 74, 44, 0.08)' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#5a4a2c', fontSize: '16px', marginBottom: '4px' }}>{product.name}</div>
                            <div style={{ fontSize: '14px', color: '#6b5d4f', lineHeight: '1.4' }}>{product.description}</div>
                            <div style={{ fontSize: '12px', color: '#a89988', fontFamily: 'monospace', marginTop: '4px' }}>ID: {product.id.substring(0, 8)}...</div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid rgba(90, 74, 44, 0.08)' }}>
                          <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', background: 'linear-gradient(135deg, #7c9d96 0%, #5a8079 100%)', color: 'white', display: 'inline-block' }}>
                            {product.category || 'uncategorized'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid rgba(90, 74, 44, 0.08)', color: '#5a4a2c', fontSize: '16px', fontWeight: '600' }}>
                          ${product.price}
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid rgba(90, 74, 44, 0.08)', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => openEditModal(product)}
                              style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #8b7355 0%, #5a4a2c 100%)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', transition: 'transform 0.2s ease' }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #c46f5c 0%, #a85a4a 100%)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', transition: 'transform 0.2s ease' }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(90, 74, 44, 0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', color: '#5a4a2c', margin: 0, fontWeight: '600' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: '#8b7355', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5a4a2c', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <ImageIcon size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Product Image {!editingProduct && '*'}
                </label>

                {imagePreview && (
                  <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', border: '2px solid rgba(90, 74, 44, 0.2)', position: 'relative' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: null });
                      }}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <div
                  style={{ border: '2px dashed rgba(90, 74, 44, 0.3)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', background: uploadingImage ? '#f5f3ef' : 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#5a4a2c'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(90, 74, 44, 0.3)'}
                  onClick={() => !uploadingImage && document.getElementById('imageInput').click()}
                >
                  {uploadingImage ? (
                    <>
                      <div className="spinner" style={{ margin: '0 auto 8px' }}></div>
                      <p style={{ margin: 0, color: '#6b5d4f', fontSize: '14px' }}>Uploading image...</p>
                    </>
                  ) : (
                    <>
                      <Upload size={32} style={{ color: '#8b7355', marginBottom: '8px' }} />
                      <p style={{ margin: 0, color: '#6b5d4f', fontSize: '14px' }}>
                        Click to upload or drag and drop
                      </p>
                      <p style={{ margin: '4px 0 0', color: '#a89988', fontSize: '12px' }}>
                        PNG, JPG, WebP (max 5MB)
                      </p>
                    </>
                  )}
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5a4a2c', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <FileText size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(90, 74, 44, 0.2)', borderRadius: '8px', fontSize: '15px', fontFamily: 'serif', color: '#5a4a2c', outline: 'none', transition: 'border-color 0.3s ease' }}
                  onFocus={(e) => e.target.style.borderColor = '#5a4a2c'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(90, 74, 44, 0.2)'}
                  placeholder="Enter product title"
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#5a4a2c', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <FileText size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(90, 74, 44, 0.2)', borderRadius: '8px', fontSize: '15px', fontFamily: 'serif', color: '#5a4a2c', outline: 'none', resize: 'vertical', transition: 'border-color 0.3s ease' }}
                  onFocus={(e) => e.target.style.borderColor = '#5a4a2c'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(90, 74, 44, 0.2)'}
                  placeholder="Enter product description"
                />
              </div>

              {/* Category and Price Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {/* Category */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#5a4a2c', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <Tag size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(90, 74, 44, 0.2)', borderRadius: '8px', fontSize: '15px', fontFamily: 'serif', color: '#5a4a2c', outline: 'none', cursor: 'pointer', background: 'white', transition: 'border-color 0.3s ease' }}
                    onFocus={(e) => e.target.style.borderColor = '#5a4a2c'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(90, 74, 44, 0.2)'}
                  >
                    {categories.filter(cat => cat !== 'all').map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#5a4a2c', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <DollarSign size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Price *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(90, 74, 44, 0.2)', borderRadius: '8px', fontSize: '15px', fontFamily: 'serif', color: '#5a4a2c', outline: 'none', transition: 'border-color 0.3s ease' }}
                    onFocus={(e) => e.target.style.borderColor = '#5a4a2c'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(90, 74, 44, 0.2)'}
                    placeholder="$199"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading || uploadingImage}
                  style={{ flex: 1, padding: '14px 24px', background: '#e8e6e1', border: '1px solid rgba(90, 74, 44, 0.2)', borderRadius: '8px', color: '#5a4a2c', fontSize: '15px', fontWeight: '600', cursor: (loading || uploadingImage) ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', fontFamily: 'serif', opacity: (loading || uploadingImage) ? 0.6 : 1 }}
                  onMouseEnter={(e) => {
                    if (!loading && !uploadingImage) e.currentTarget.style.background = '#ded9d2';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && !uploadingImage) e.currentTarget.style.background = '#e8e6e1';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  style={{ flex: 1, padding: '14px 24px', background: (loading || uploadingImage) ? '#a89988' : 'linear-gradient(135deg, #5a4a2c 0%, #8b7355 100%)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: (loading || uploadingImage) ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', fontFamily: 'serif' }}
                  onMouseEnter={(e) => {
                    if (!loading && !uploadingImage) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(90, 74, 44, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && !uploadingImage) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {uploadingImage ? 'Uploading Image...' : loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}