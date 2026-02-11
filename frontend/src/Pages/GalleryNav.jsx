import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/wildLogo.png";
import './GalleryNav.css';

const GalleryNavBar = ({ wishlistCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="gallery-navbar">
      <div className="gallery-navbar-container">
        {/* Logo and Brand Name */}
        <div className="gallery-navbar-brand">
          <Link to="/" className="gallery-brand-link" onClick={closeMobileMenu}>
            <div className="gallery-logo">
              <img src={logo} alt="Wild Logo" className="logo-image" />
            </div>
            <span className="gallery-brand-name">My Wild Trails</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className={`gallery-nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="gallery-nav-item">
            <Link 
              to="/" 
              className={`gallery-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>
          </li>
          <li className="gallery-nav-item">
            <Link 
              to="/wishlist" 
              className={`gallery-nav-link ${isActive('/wishlist') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Wishlist</span>
              <span className="gallery-cart-badge">{wishlistCount}</span>
            </Link>
          </li>
          <li className="gallery-nav-item">
            <Link 
              to="/cart" 
              className={`gallery-nav-link ${isActive('/cart') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Cart</span>
              <span className="gallery-cart-badge">0</span>
            </Link>
          </li>
          <li className="gallery-nav-item">
            <Link 
              to="/profile" 
              className={`gallery-nav-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button 
          className={`gallery-mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default GalleryNavBar;