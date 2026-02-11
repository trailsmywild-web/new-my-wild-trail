import React from "react";
import { useNavigate } from "react-router-dom";
import "./Slogan.css";

const Slogan = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGalleryClick = () => {
    navigate('/gallery');
  };

  return (
    <div className="slogan-wrapper">
      <div className="slogan-container">
        <div className="slogan-content">
          <h1 className="slogan-heading">
            Capture The <span className="highlight">Wild</span>
            <br />
            In Its Pure Form
          </h1>

          <div className="slogan-buttons">
            <button className="btn-primary1" onClick={handleGalleryClick}>
              Explore Gallery
            </button>
            <button className="btn-outline" onClick={handleLoginClick}>
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slogan;