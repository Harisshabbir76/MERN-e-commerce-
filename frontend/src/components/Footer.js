import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './heroSlider.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <Row>
          {/* Quick Links Column - Left on mobile */}
          <Col xs={6} md={6} className="footer-col">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/catalog">Shop</a></li>
              <li><a href="/category/t-shirt">T-Shirts</a></li>
              <li><a href="/category/bottom">Bottoms</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>

          {/* Contact Info Column - Right on mobile */}
          <Col xs={6} md={6} className="footer-col">
            <h5 className="footer-heading">Contact Info</h5>
            <ul className="contact-info">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Fashion Street, Style City</span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>(123) 456-7890</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>info@rovairfashion.com</span>
              </li>
            </ul>
            
            {/* Social Icons moved here */}
            <div className="social-icons">
              <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
            </div>
          </Col>
        </Row>

        <Row className="footer-bottom">
          <Col className="text-center">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Rovair Fashion. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}