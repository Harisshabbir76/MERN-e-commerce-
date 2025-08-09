import React from 'react'
import Categories from '../components/category'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi';
import HeroSlider from '../components/HeroSlider'
import { useEffect, useState } from 'react';
import Tshirt from '../components/t-shirt'
import Bottom from '../components/bottom'
import ContactUs from './contact-us'


export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 320);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div>
      

      <div >
        {!isMobile && <HeroSlider />} {/* Only shows on screens >320px */}
        
        
        
        <Categories />
        <Tshirt />
        <Bottom/>
        <ContactUs />

      </div>

    </div>
  )
}
