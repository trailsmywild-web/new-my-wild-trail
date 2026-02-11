import React, { useState } from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import './Footer.css';
import logo from "../assets/wildLogo.png";

// Simple X (Twitter) icon component
const XIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Simple LinkedIn icon component
const LinkedInIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState(false);

  const handleSubmit = () => {
    console.log('Form submitted:', { email, subscribe });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Column */}
        <div className="footer-left">
          <div className="footer-logo-title">
            <img src={logo} alt="Wild Logo" className="footer-logo" />
            <h1 className="footer-title">My Wild trails</h1>
          </div>

          <div className="footer-contact offset-left">
            <p>123-456-7890</p>
            <p>info@mysite.com</p>
          </div>

          <div className="footer-address">
            <p>500 Terry Francine St. San</p>
            <p>Francisco, CA 94158</p>
          </div>
        </div>

        {/* Right Column - Social Icons */}
        <div className="footer-social">
          <Instagram size={24} />
          <Facebook size={24} />
          <XIcon size={24} />
          <LinkedInIcon size={24} />
          <Youtube size={24} />
        </div>
        
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 Design by Royals Webtech</p>
      </div>
    </footer>
  );
}