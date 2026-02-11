import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeaturedPhotos.css';

import bestseller from "../assets/bestsellerlion.jpeg";
import king from "../assets/king.jpeg";
import egle from "../assets/egle.jpeg";
import Elephant from "../assets/Elephant.jpeg";
import crocodile from "../assets/crocodile.jpeg";
import bear from "../assets/bear.jpeg";

const FeaturedPhotos = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const featuredPhotos = [
    {
      id: 1,
      src: bestseller,
      title: "Majestic Tiger Portrait",
      category: "Big Cats",
      price: "$89.99",
      badge: "Best Seller",
      badgeType: "bestseller",
      photographer: "Wild Explorer",
      likes: 234
    },
    {
      id: 2,
      src: king, 
      title: "The King at the Water's Edge",
      category: "King",
      price: "$74.99",
      badge: "Featured",
      badgeType: "featured",
      photographer: "Nature Hunter",
      likes: 189
    },
    {
      id: 3,
      src: egle,
      title: "Wings of Freedom",
      category: "Birds",
      price: "$65.99",
      badge: "New Arrival",
      badgeType: "new",
      photographer: "Feather Focus",
      likes: 156
    },
    {
      id: 4,
      src: Elephant,
      title: "Elephant Family Bond",
      category: "Elephants", 
      price: "$95.99",
      badge: "Editor's Choice",
      badgeType: "editors",
      photographer: "Safari Stories",
      likes: 298
    },
    {
      id: 5,
      src: crocodile, 
      title: "Eyes Above the Water",
      category: "Crocodile",
      price: "$70.99",
      badge: "Mostly Viewed",
      badgeType: "viewed",
      photographer: "Okavango Delta Predator",
      likes: 111
    },
    {
      id: 6,
      src: bear, 
      title: "Strength of Nature",
      category: "Bear",
      price: "$80.99",
      badge: "Recommended",
      badgeType: "recommendation",
      photographer: "Amazon Jungle Giant",
      likes: 188
    },
  ];

  /* 🔥 KEY CHANGE HERE */
  const handleBrowseGallery = () => {
    navigate('/gallery', {
      state: { filter: 'featured' }
    });
  };

  return (
    <section id="featuredphotos" className="featured-section">
      <div className="container">

        <div className="section-header">
          <div className="header-content">
            <span className="section-subtitle">Handpicked Collection</span>
            <h2 className="section-title">Featured Wildlife Photography</h2>
            <p className="section-description">
              Discover our most captivating wildlife moments, carefully selected
              for their exceptional beauty and artistic merit.
            </p>
          </div>
        </div>

        <div className="featured-grid">
          {featuredPhotos.map(photo => (
            <div
              key={photo.id}
              className="featured-card"
              onMouseEnter={() => setHoveredItem(photo.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="card-image-wrapper">
                <img src={photo.src} alt={photo.title} className="card-image" />

                <div className={`badge badge-${photo.badgeType}`}>
                  {photo.badge}
                </div>

                <div className={`card-overlay ${hoveredItem === photo.id ? 'visible' : ''}`}>
                  <div className="overlay-content">
                    <span className="likes">❤️ {photo.likes}</span>
                  </div>
                </div>
              </div>

              <div className="card-content">
                <span className="photo-category">{photo.category}</span>
                <h3 className="photo-title">{photo.title}</h3>
                <p className="photo-photographer">by {photo.photographer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <button className="cta-button secondary" onClick={handleBrowseGallery}>
            Browse Gallery
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedPhotos;
