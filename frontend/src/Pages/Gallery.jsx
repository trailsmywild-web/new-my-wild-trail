import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { getAllProducts } from '../firebase/firestore';
import GalleryNavBar from './GalleryNav';
import LoginModal from './LoginModal';
import SuccessModal from './SuccessModal';
import './Gallery.css';

const WildlifeGallery = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentFilter, setCurrentFilter] = useState('all');
  const [lightboxData, setLightboxData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', message: '' });
  
  // 🔥 NEW: State for products from Firebase
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 NEW: Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getAllProducts();
        
        if (result.success) {
          // Transform Firestore products to match our photo structure
          const transformedProducts = result.data.map(product => ({
            id: product.id,
            image: product.imageUrl || '', // Firebase Storage URL
            category: product.category || 'mammals',
            title: product.title || 'Untitled',
            description: product.description || 'No description',
            price: product.price || '$0'
          }));
          
          setPhotos(transformedProducts);
        } else {
          setError(result.error || 'Failed to fetch products');
          console.error('Failed to fetch products:', result.error);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* 🔥 APPLY FILTER FROM NAVIGATION */
  useEffect(() => {
    if (location.state?.filter) {
      setCurrentFilter(location.state.filter);
    }
  }, [location.state]);

  // Load wishlist and cart from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (isLoggedIn) {
        const savedWishlist = localStorage.getItem('wishlist');
        const savedCart = localStorage.getItem('cart');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } else {
        // Clear wishlist and cart if not logged in
        setWishlist([]);
        setCart([]);
      }
    };

    loadData();
  }, []);

  // 🔥 RE-CHECK AUTH AND RELOAD WISHLIST AND CART when coming back to this page
  useEffect(() => {
    const handleFocus = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (!isLoggedIn) {
        // User signed out, clear wishlist and cart
        setWishlist([]);
        setCart([]);
      } else {
        // User is logged in, reload wishlist and cart
        const savedWishlist = localStorage.getItem('wishlist');
        const savedCart = localStorage.getItem('cart');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      }
    };

    // Listen for when user comes back to this tab/window
    window.addEventListener('focus', handleFocus);
    
    // Also check when component mounts or navigation happens
    handleFocus();

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [location]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Toggle wishlist function with login check
  const toggleWishlist = (e, photoId) => {
    e.stopPropagation(); // Prevent opening lightbox
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      // Show login modal
      setShowLoginModal(true);
      return;
    }

    // Get photo details for message
    const photo = photos.find(p => p.id === photoId);

    // User is logged in, proceed with wishlist toggle
    if (wishlist.includes(photoId)) {
      // Remove from wishlist
      setWishlist(wishlist.filter(id => id !== photoId));
      setModalMessage({
        title: 'Removed from Wishlist',
        message: `${photo.title} has been removed from your wishlist.`
      });
      setShowSuccessModal(true);
    } else {
      // Add to wishlist
      setWishlist([...wishlist, photoId]);
      setModalMessage({
        title: 'Added to Wishlist!',
        message: `${photo.title} has been added to your wishlist.`
      });
      setShowSuccessModal(true);
    }
  };

  // Add to cart function with login check
  const addToCart = (e, photoId) => {
    e.stopPropagation(); // Prevent opening lightbox
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      // Show login modal
      setShowLoginModal(true);
      return;
    }

    // Get photo details for message
    const photo = photos.find(p => p.id === photoId);

    // User is logged in, proceed with adding to cart
    if (cart.includes(photoId)) {
      // Already in cart
      setModalMessage({
        title: 'Already in Cart',
        message: `${photo.title} is already in your cart.`
      });
      setShowSuccessModal(true);
    } else {
      // Add to cart
      setCart([...cart, photoId]);
      setModalMessage({
        title: 'Added to Cart!',
        message: `${photo.title} has been added to your cart.`
      });
      setShowSuccessModal(true);
    }
  };

  // Buy now function with login check
  const buyNow = (e, photoId) => {
    e.stopPropagation(); // Prevent opening lightbox
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      // Show login modal
      setShowLoginModal(true);
      return;
    }

    // Get photo details for message
    const photo = photos.find(p => p.id === photoId);

    // User is logged in, proceed with buy now
    setModalMessage({
      title: 'Proceeding to Checkout',
      message: `Processing purchase for ${photo.title} at ${photo.price}.`
    });
    setShowSuccessModal(true);
  };

  // Handle login modal confirm
  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: '/gallery' } });
  };

  // Handle login modal close
  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  // Check if photo is in wishlist
  const isInWishlist = (photoId) => wishlist.includes(photoId);

  const categories = ['all', 'featured', 'mammals', 'birds', 'marine', 'amphibian', 'reptiles', 'insects'];

  const filteredPhotos = photos.filter(
    p =>
      (currentFilter === 'all' || p.category === currentFilter) &&
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      {/* Gallery Navbar */}
      <GalleryNavBar wishlistCount={wishlist.length} />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={handleLoginClose}
        onConfirm={handleLoginConfirm}
        title="Login Required"
        message="Please login to add items to your wishlist and enjoy personalized features."
      />

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={modalMessage.title}
        message={modalMessage.message}
        buttonText="Got it!"
      />
      
      <div className="wildlife-gallery">
        <header className="gallery-header">
          <p className="gallery-tagline">Capturing Nature's Untamed Beauty</p>
        </header>

        <div className="search-filter-container">
          <input
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${currentFilter === cat ? 'active' : ''}`}
              onClick={() => setCurrentFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🔥 NEW: Loading State */}
        {loading && (
          <div className="loading-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '18px',
            color: '#5a4a2c'
          }}>
            <div className="spinner"></div>
            <p style={{ marginLeft: '16px' }}>Loading wildlife photography...</p>
          </div>
        )}

        {/* 🔥 NEW: Error State */}
        {error && !loading && (
          <div className="error-container" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '18px', color: '#c46f5c', marginBottom: '12px' }}>
              Failed to load products
            </p>
            <p style={{ fontSize: '14px', color: '#8b7355' }}>
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #5a4a2c 0%, #8b7355 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* 🔥 NEW: Empty State */}
        {!loading && !error && photos.length === 0 && (
          <div className="empty-container" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '18px', color: '#5a4a2c', marginBottom: '8px' }}>
              No products available yet
            </p>
            <p style={{ fontSize: '14px', color: '#8b7355' }}>
              Check back soon for amazing wildlife photography!
            </p>
          </div>
        )}

        {/* Gallery Grid - Only show if we have photos */}
        {!loading && !error && photos.length > 0 && (
          <>
            {filteredPhotos.length === 0 ? (
              <div className="no-results-container" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                padding: '40px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '18px', color: '#5a4a2c', marginBottom: '8px' }}>
                  No products match your search
                </p>
                <p style={{ fontSize: '14px', color: '#8b7355' }}>
                  Try different keywords or filters
                </p>
              </div>
            ) : (
              <div className="gallery-grid">
                {filteredPhotos.map(photo => (
                  <div
                    key={photo.id}
                    className="gallery-item"
                    onClick={() => setLightboxData(photo)}
                  >
                    <img 
                      src={photo.image} 
                      alt={photo.title} 
                      className="gallery-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                      }}
                    />
                    <div className="watermark">©</div>

                    {/* ❤️ WISHLIST HEART BUTTON */}
                    <button
                      className={`wishlist-btn ${isInWishlist(photo.id) ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(e, photo.id)}
                      aria-label="Add to wishlist"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={isInWishlist(photo.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    
                    <span className="category-tag">{photo.category}</span>
                    <div className="gallery-overlay">
                      <h3 className="overlay-title">{photo.title}</h3>
                      <p className="overlay-description">{photo.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Product Card Modal */}
        {lightboxData && (
          <div className="product-card-modal" onClick={() => setLightboxData(null)}>
            <div className="product-card" onClick={(e) => e.stopPropagation()}>
              <button className="close-card-btn" onClick={() => setLightboxData(null)}>
                ×
              </button>
              
              <div className="product-card-image-container">
                <img 
                  src={lightboxData.image} 
                  alt={lightboxData.title} 
                  className="product-card-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                  }}
                />
                <div className="watermark watermark-card">©</div>
              </div>
              
              <div className="product-card-content">
                <span className="product-card-category">{lightboxData.category}</span>
                <h2 className="product-card-title">{lightboxData.title}</h2>
                <p className="product-card-description">{lightboxData.description}</p>
                <div className="product-card-price">{lightboxData.price}</div>
                
                <div className="product-card-buttons">
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => addToCart(e, lightboxData.id)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="buy-now-btn1"
                    onClick={(e) => buyNow(e, lightboxData.id)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WildlifeGallery;