import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Preview.css";

import parrot from "../assets/previewParrot.jpeg";
import Rhino from "../assets/PreviewRhino.jpeg";
import wolf from "../assets/previewWolf.jpeg";

const Preview = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const images = [
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf,
    parrot, Rhino, wolf
  ];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    let isPaused = false;

    const autoScroll = () => {
      if (!isPaused) {
        scrollContainer.scrollLeft += 1;

        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    const handleMouseEnter = () => (isPaused = true);
    const handleMouseLeave = () => (isPaused = false);

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  /* CHANGE HERE */
  const handlePrintStore = () => {
    navigate("/gallery", {
      state: { filter: "featured" }
    });
  };

  return (
    <div id="gallery" className="preview-section">
      <div className="preview-wrapper">

        <div className="preview-header">
          <h1>Gallery Preview</h1>
        </div>

        <div ref={scrollContainerRef} className="preview-scroll">
          <div className="preview-row">
            {images.map((image, index) => (
              <div className="preview-card" key={index}>
                <img src={image} alt={`Gallery ${index + 1}`} />
                <span className="trademark-overlay">©</span>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="preview-btn-wrapper">
          <button className="preview-btn" onClick={handlePrintStore}>
            Print Store
          </button>
        </div> */}

      </div>
    </div>
  );
};

export default Preview;
