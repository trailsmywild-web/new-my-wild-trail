import React from 'react';
import { useNavigate } from 'react-router-dom';
import GalleryNavBar from './GalleryNav';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();

  return (
    <>
      <GalleryNavBar />
      
      <div className="cart-page">
        <header className="cart-header">
          <h1>Shopping Cart</h1>
          <p>0 items</p>
        </header>

        <div className="empty-cart">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add some amazing wildlife photos to your cart!</p>
          <button className="browse-btn" onClick={() => navigate('/gallery')}>
            Browse Gallery
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;