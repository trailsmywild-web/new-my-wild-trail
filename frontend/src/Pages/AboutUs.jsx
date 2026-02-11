import React from 'react';
import './AboutUs.css';
import bg from '../assets/aboutbg.jpg';
// import photographerImg from '../assets/fox.jpg';
import photo from '../assets/Photographer.jpg';

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section 
        className="hero" 
        style={{ 
          backgroundImage: `url(${bg})` 
        }}
      >
        <div className="hero-overlay">
          <h1>Vishal </h1>
          <p className="hero-subtitle">Wildlife Photographer | Central India</p>
        </div>
      </section>

      {/* Photographer Introduction */}
      <section className="photographer-intro">
        <div className="intro-card">
          <div 
            className="intro-image"
            style={{ backgroundImage: `url(${photo})` }}
          ></div>
          
          <div className="intro-content">
            <span className="intro-label">From Corporate to Conservation</span>
            <h2>A Passion Transformed</h2>
            <p>
              After having worked for several years as an IT professional in an IT services 
              company, Vishal chose to transform his passion for wildlife photography into work. 
              His love for the forests in and around Nagpur turned him to choose Central India 
              as his main area of work and he left the cozy comforts of corporate offices to 
              work on the field.
            </p>
            <p>
              He approached photography being motivated by an innate love for Nature and by 
              the desire to transmit its magnificence through inspiring images that generate 
              a sense of respect and protection. He learnt the photographic technique by 
              working persistently in the field with DSLR cameras and participating in various 
              forest events thus building up an experience of about ten years.
            </p>
            
            <div className="intro-highlight">
              <p>
                His creative and emotional attachment to nature is at the very heart of each 
                image, creating a unique and artistic reflection of time and efforts in the field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="journey-section1">
        <div className="section-header1">
          <h2>Photographic Approach</h2>
          <div className="section-divider1"></div>
          <p>
            Capturing the essence of wildlife through patience, observation, and respect for nature.
          </p>
        </div>

        <div className="journey-grid">
          <div className="journey-card">
            <div 
              className="journey-image"
              style={{ 
                backgroundImage: `url(https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068)` 
              }}
            ></div>
            <div className="journey-content">
              <span className="journey-year">The Moment</span>
              <h3>Capturing Fleeting Instances</h3>
              <p>
                When photographing wildlife, Vishal focuses on capturing the briefest of moments—
                the motion, the momentary eye contact with an animal or bird, the light in an eye, 
                and the transient light at dawn and dusk.
              </p>
            </div>
          </div>

          <div className="journey-card">
            <div 
              className="journey-image"
              style={{ 
                backgroundImage: `url(https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2070)` 
              }}
            ></div>
            <div className="journey-content">
              <span className="journey-year">Connection</span>
              <h3>Emotions in the Wild</h3>
              <p>
                "The more I spent time in forest and observe wildlife, the more I am convinced 
                both birds and animals have emotions, feelings and style. I strive to capture 
                every moment by going as close as possible to see better detail, colour and spirit."
              </p>
            </div>
          </div>

          <div className="journey-card">
            <div 
              className="journey-image"
              style={{ 
                backgroundImage: `url(https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2076)` 
              }}
            ></div>
            <div className="journey-content">
              <span className="journey-year">Artistry</span>
              <h3>Beauty, Mood & Emotion</h3>
              <p>
                Each image represents an event that occurred in the wild—something witnessed 
                and recorded. The skill lies in interpreting and presenting this in a way that 
                invokes beauty, mood and emotion with each moment captured.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <div className="philosophy-content">
          <h2>Conservation & Vision</h2>
          <div className="philosophy-quote">
            Let us wonder at nature and do everything we can to hang on to it
          </div>
          <p className="philosophy-text">
            My images represent an event that occurred in the wild, something that I witnessed 
            and recorded with my camera. It is my intention to use these reflections of the 
            natural world to bring people's awareness of what beautiful wildlife we have on 
            our doorstep and all around us, and the importance of conservation and the need 
            to preserve our national heritage.
          </p>
          <p className="philosophy-text" style={{ marginTop: '1.5rem' }}>
            My representation of this world is my interest for creating a unique and artistic 
            reflection of what I see. My images are simplified visions of this seen through 
            my eyes, with the emphasis on composition, lighting and colour at the very heart 
            of each picture, capturing their beauty, fascination and graceful expression.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Years in Field</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">Central India</span>
            <span className="stat-label">Primary Focus</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">Nagpur</span>
            <span className="stat-label">Based In</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">Nature</span>
            <span className="stat-label">Life's Passion</span>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="message-section">
        <div className="message-content">
          <h2>A Message from Vishal</h2>
          <div className="message-text">
            <p>
              When we are today struggling for an inner peace and our instinct is to search 
              for that which makes us smile and breathe more deeply, then I hope my images 
              will delight the sight and mind of the observer.
            </p>
            <p>
              I am sure that when we live in the concrete jungles of cities and dream for a 
              better life, it is really an instinct calling us back to the freedom and wonder 
              of nature.
            </p>
            <p className="message-highlight">
              All these aspects help to illustrate the beauty and might of nature and provide 
              a lasting impression that I hope enthuses and excites the onlooker.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;