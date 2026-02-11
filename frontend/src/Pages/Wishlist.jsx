import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GalleryNavBar from './GalleryNav';
import LoginModal from './LoginModal';
import SuccessModal from './SuccessModal';
import './Wishlist.css';

/* Import all images - same as Gallery */
import bat from '../assets/Bat.jpg'; 
import Bird from '../assets/BeautifulBird.jpg';
import bison from '../assets/Bison.jpg';
import capybara from '../assets/Capybara.jpg';
import caterpillar from '../assets/Caterpillar.jpg';
import chameleon from '../assets/Chameleon.jpg';
import chimpanzee from '../assets/Chimpanzee.jpg';
import crab from '../assets/Crab.jpg';
import dhole from '../assets/Dhole.jpg';
import elk from '../assets/Elk.jpg';
import flamingo from '../assets/Flamingo.jpg';
import frog from '../assets/Frog.jpg';
import gazelle from '../assets/Gazelle.jpg';
import heron from '../assets/Heron.jpg';
import hippo from '../assets/Hippopotamus.jpg';
import hornbill from '../assets/Hornbill.jpg';
import insect from '../assets/Insect.jpg';
import jackal from '../assets/Jackal.jpg';
import jaguar from '../assets/Jaguar.jpg';
import leopard from '../assets/Leopard.jpg';
import lobster from '../assets/Lobster.jpg';
import macaw from '../assets/Macaw.jpg';
import muskrat from '../assets/Muskrat.jpg';
import owl from '../assets/Owl.jpg';
import polar from '../assets/Polar Bear.jpg';
import puma from '../assets/Puma.jpg';
import scorpion from '../assets/Scorpion.jpg';
import shark from '../assets/Shark.jpg';
import sloth from '../assets/Sloth Bear.jpg';
import snail from '../assets/Snail.jpg';
import tortoise from '../assets/Tortoise.jpg';
import whale from '../assets/Whale.jpg';
import zebra from '../assets/Zebra.jpg';
import bestseller from "../assets/bestsellerlion.jpeg";
import king from "../assets/king.jpeg";
import egle from "../assets/egle.jpeg";
import Elephant from "../assets/Elephant.jpeg";
import crocodile from "../assets/crocodile.jpeg";
import bear from "../assets/bear.jpeg";
import parrot from "../assets/previewParrot.jpeg";
import Rhino from "../assets/PreviewRhino.jpeg";
import wolf from "../assets/previewWolf.jpeg";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', message: '' });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // All photos data
  const allPhotos = [
    { id: 1001, image: bestseller, category: 'featured', title: 'Best Seller Lion', description: 'Iconic wildlife capture.', price: 49.99 },
    { id: 1002, image: king, category: 'featured', title: 'King of the Jungle', description: 'Power and dominance.', price: 59.99 },
    { id: 1003, image: egle, category: 'featured', title: 'Eagle Vision', description: 'Sharp eyes, endless skies.', price: 45.99 },
    { id: 1004, image: Elephant, category: 'featured', title: 'Gentle Giant', description: 'Majestic elephant.', price: 54.99 },
    { id: 1005, image: crocodile, category: 'featured', title: 'Silent Predator', description: 'Lurking beneath waters.', price: 47.99 },
    { id: 1006, image: bear, category: 'featured', title: 'Wild Bear', description: 'Raw wilderness energy.', price: 52.99 },
    { id: 1007, image: parrot, category: 'featured', title: 'Colorful Parrot', description: 'Tropical beauty.', price: 39.99 },
    { id: 1008, image: Rhino, category: 'featured', title: 'Mighty Rhino', description: 'Strength and resilience.', price: 56.99 },
    { id: 1009, image: wolf, category: 'featured', title: 'Lone Wolf', description: 'Spirit of the wild.', price: 48.99 },
    { id: 1, image: bat, category: 'mammals', title: 'Majestic Lion', description: 'Golden hour.', price: 44.99 },
    { id: 2, image: Bird, category: 'birds', title: 'Eagle in Flight', description: 'Soaring.', price: 42.99 },
    { id: 3, image: bison, category: 'mammals', title: 'Bison', description: 'Plains.', price: 38.99 },
    { id: 4, image: capybara, category: 'mammals', title: 'Capybara', description: 'Relaxing.', price: 35.99 },
    { id: 5, image: caterpillar, category: 'insects', title: 'Caterpillar', description: 'Macro.', price: 29.99 },
    { id: 6, image: chameleon, category: 'reptiles', title: 'Chameleon', description: 'Camouflage.', price: 41.99 },
    { id: 7, image: frog, category: 'amphibian', title: 'Tree Frog', description: 'Green.', price: 33.99 },
    { id: 8, image: chimpanzee, category: 'mammals', title: 'Chimpanzee', description: 'Curious.', price: 46.99 },
    { id: 9, image: crab, category: 'marine', title: 'Crabs', description: 'Beach.', price: 31.99 },
    { id: 10, image: dhole, category: 'mammals', title: 'Dhole', description: 'Forest.', price: 43.99 },
    { id: 11, image: elk, category: 'mammals', title: 'Elk', description: 'Autumn.', price: 47.99 },
    { id: 12, image: flamingo, category: 'birds', title: 'Flamingo', description: 'Pink.', price: 40.99 },
    { id: 13, image: gazelle, category: 'mammals', title: 'Gazelle', description: 'Leap.', price: 45.99 },
    { id: 14, image: heron, category: 'birds', title: 'Heron', description: 'Marsh.', price: 37.99 },
    { id: 15, image: hippo, category: 'mammals', title: 'Hippo', description: 'River.', price: 49.99 },
    { id: 16, image: hornbill, category: 'birds', title: 'Hornbill', description: 'Tropical.', price: 42.99 },
    { id: 17, image: insect, category: 'insects', title: 'Insect', description: 'Macro.', price: 28.99 },
    { id: 18, image: jackal, category: 'mammals', title: 'Jackal', description: 'Alert.', price: 41.99 },
    { id: 19, image: jaguar, category: 'mammals', title: 'Jaguar', description: 'Power.', price: 54.99 },
    { id: 20, image: leopard, category: 'mammals', title: 'Leopard', description: 'Stealth.', price: 52.99 },
    { id: 21, image: lobster, category: 'marine', title: 'Lobster', description: 'Ocean.', price: 36.99 },
    { id: 22, image: macaw, category: 'birds', title: 'Macaw', description: 'Colorful.', price: 44.99 },
    { id: 23, image: muskrat, category: 'mammals', title: 'Muskrat', description: 'Swimmer.', price: 32.99 },
    { id: 24, image: owl, category: 'birds', title: 'Owl', description: 'Night.', price: 43.99 },
    { id: 25, image: polar, category: 'mammals', title: 'Polar Bear', description: 'Arctic.', price: 58.99 },
    { id: 26, image: puma, category: 'mammals', title: 'Puma', description: 'Mountain.', price: 51.99 },
    { id: 27, image: scorpion, category: 'insects', title: 'Scorpion', description: 'Desert.', price: 30.99 },
    { id: 28, image: shark, category: 'marine', title: 'Shark', description: 'Hunter.', price: 55.99 },
    { id: 29, image: sloth, category: 'mammals', title: 'Sloth Bear', description: 'Forest.', price: 46.99 },
    { id: 30, image: snail, category: 'insects', title: 'Snail', description: 'Slow.', price: 27.99 },
    { id: 31, image: tortoise, category: 'marine', title: 'Tortoise', description: 'Ancient.', price: 39.99 },
    { id: 32, image: whale, category: 'marine', title: 'Whale', description: 'Giant.', price: 62.99 },
    { id: 33, image: zebra, category: 'mammals', title: 'Zebra', description: 'Stripes.', price: 48.99 },
  ];

  // Check login status and load data
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (!loggedIn) {
        // Show login modal instead of redirecting immediately
        setShowLoginModal(true);
        setIsCheckingAuth(false);
        return;
      }

      // Load wishlist and cart data if logged in
      const savedWishlist = localStorage.getItem('wishlist');
      const savedCart = localStorage.getItem('cart');
      
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Error parsing wishlist:', error);
          setWishlist([]);
        }
      }
      
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart:', error);
          setCart([]);
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [navigate]);

  // Handle login modal
  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: '/wishlist' }, replace: true });
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    navigate('/gallery', { replace: true });
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return null; // or return a loading spinner
  }

  // Get wishlist items
  const wishlistItems = allPhotos.filter(photo => wishlist.includes(photo.id));

  // Remove from wishlist
  const removeFromWishlist = (photoId) => {
    const updatedWishlist = wishlist.filter(id => id !== photoId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // Add to cart
  const addToCart = (photo) => {
    const isInCart = cart.some(item => item.id === photo.id);
    if (!isInCart) {
      const updatedCart = [...cart, { ...photo, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Show success modal
      setModalMessage({
        title: 'Added to Cart!',
        message: `${photo.title} has been successfully added to your cart.`
      });
      setShowSuccessModal(true);
    } else {
      // Show info modal
      setModalMessage({
        title: 'Already in Cart',
        message: `${photo.title} is already in your cart.`
      });
      setShowSuccessModal(true);
    }
  };

  // Buy now - goes directly to cart
  const buyNow = (photo) => {
    const isInCart = cart.some(item => item.id === photo.id);
    if (!isInCart) {
      const updatedCart = [...cart, { ...photo, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    navigate('/cart');
  };

  return (
    <>
      <GalleryNavBar wishlistCount={wishlist.length} />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={handleLoginClose}
        onConfirm={handleLoginConfirm}
        title="Login Required"
        message="Please login to view your wishlist and enjoy personalized features."
      />
      
      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={modalMessage.title}
        message={modalMessage.message}
        buttonText="Got it!"
      />
      
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <h1 className="wishlist-title">My Wishlist</h1>
            <p className="wishlist-count">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <h2>Your wishlist is empty</h2>
              <p>Start adding items you love to your wishlist!</p>
              <button className="browse-btn" onClick={() => navigate('/gallery')}>
                Browse Gallery
              </button>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlistItems.map(item => (
                <div key={item.id} className="wishlist-item">
                  <div className="wishlist-image-container">
                    <img src={item.image} alt={item.title} className="wishlist-image" />
                    <button 
                      className="remove-wishlist-btn"
                      onClick={() => removeFromWishlist(item.id)}
                      aria-label="Remove from wishlist"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                    <span className="wishlist-category-tag">{item.category}</span>
                  </div>
                  
                  <div className="wishlist-details">
                    <h3 className="wishlist-item-title">{item.title}</h3>
                    <p className="wishlist-item-description">{item.description}</p>
                    <div className="wishlist-price">${item.price}</div>
                    
                    <div className="wishlist-actions">
                      <button 
                        className="add-cart-btn"
                        onClick={() => addToCart(item)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Add to Cart
                      </button>
                      
                      <button 
                        className="buy-now-btn"
                        onClick={() => buyNow(item)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;