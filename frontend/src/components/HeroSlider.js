import React, { useState, useEffect } from 'react';
import './heroSlider.css';
import hero1 from '../images/hero1.jpeg';
import hero2 from '../images/hero2.jpeg';
import hero3 from '../images/hero3.jpeg';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: hero1,
      title: 'Summer Collection',
      subtitle: 'Discover our new arrivals',
      ctaText: 'Shop Now',
      ctaLink: '/catalog'
    },
    {
      image: hero2,
      title: 'Winter Specials',
      subtitle: 'Up to 50% off selected items',
      ctaText: 'View Offers',
      ctaLink: '/catalog'
    },
    {
      image: hero3,
      title: 'New Arrivals',
      subtitle: 'Fresh styles for the season',
      ctaText: 'Explore',
      ctaLink: '/new-arrivals'
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="hero-slider">
      {/* Previous arrow button */}
      <button 
        className="slider-arrow prev-arrow" 
        onClick={goToPrev} 
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <a href={slide.ctaLink} className="cta-button">{slide.ctaText}</a>
          </div>
        </div>
      ))}
      
      {/* Next arrow button */}
      <button 
        className="slider-arrow next-arrow" 
        onClick={goToNext} 
        aria-label="Next slide"
      >
        &#10095;
      </button>
      
      {/* Dots indicator */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;