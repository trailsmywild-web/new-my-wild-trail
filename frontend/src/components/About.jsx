import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./About.css";

import rhino from "../assets/rhino.jpeg";
import sir from "../assets/sir.jpeg";
import snake from "../assets/snake.jpeg";

const About = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    { src: sir, alt: "Sir" },
    { src: rhino, alt: "Rhino" },
    { src: snake, alt: "Snake" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleLearnMore = () => {
    navigate('/about-us');
  };

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <header className="about-header">
          <h1>"THE ART OF CAPTURING MOMENTS"</h1>
          <p>Every image tells a story worth sharing.</p>
        </header>

        <div className="about-grid">
          {/* Image Block Container */}
          <div className="image-block-container">
            {/* Image Slider */}
            <div className="image-wrapper">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`image-slide ${
                    currentImage === index ? "active" : ""
                  }`}
                >
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}

              {/* Pagination */}
              <div className="pagination1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot1 ${
                      currentImage === index ? "active" : ""
                    }`}
                    onClick={() => setCurrentImage(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="about-text">
            {[
              `After several years as an IT professional at an IT services company, Vishal decided to turn his passion for wildlife photography into a career.`,
              `Drawn by his love for the forests around Nagpur, he chose Central India as his primary work area, leaving behind the comfort of corporate offices to work in the field.`,
              `Driven by a deep love for nature, he uses photography to capture its beauty and inspire respect and protection for the natural world.`,
              `He developed his photographic skills through persistent fieldwork with DSLR cameras and by participating in forest events, gaining around ten years of experience.`,
              `His deep emotional bond with nature is reflected in every image, capturing the artistry shaped by time and field experience.`,
            ].map((text, i) => (
              <p key={i}>{text}</p>
            ))}

            <div className="about-button-wrapper">
              <button className="learn-more-btn" onClick={handleLearnMore}>
                Learn More
                <span className="icon-box">
                  <ChevronRight size={16} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;