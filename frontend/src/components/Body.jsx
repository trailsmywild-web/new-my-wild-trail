// Body.jsx
import React, { useState, useEffect } from "react";
import "./Body.css";
import Deer from "../assets/Deer.jpeg";
import Slogan from "./Slogan";
import Beach from "../assets/Beach-BG.jpg";
import EleBG from "../assets/Elephant-BG.jpg";

const Body = () => {
  const images = [Deer, Beach, EleBG];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div id="home" className="body-container">
      {/* Background Image Carousel */}
      {images.map((image, index) => (
        <div
          key={index}
          className="body-background"
          style={{
            backgroundImage: `url(${image})`,
            opacity: index === currentIndex ? 0.5 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        ></div>
      ))}

      {/* Dot Indicators */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <Slogan />
      
      {/* Spacer */}
      <div className="body-spacer"></div>
    </div>
  );
};

export default Body;