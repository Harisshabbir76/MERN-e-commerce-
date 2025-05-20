import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../components/CartContext';
import './heroSlider.css';

export default function BottomProducts() {
  const [bottoms, setBottoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Get addToCart function from context

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/catalog');
        const filtered = res.data.filter(product => 
          product.category.toLowerCase() === 'bottom'
        );
        if (filtered.length === 0) {
          throw new Error('No bottoms found in our collection');
        }
        setBottoms(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1 // Default quantity
    });
    // You can add a toast notification here if needed
  };

  return (
    <Container className="bottom-products-container py-5">
      <div className="bottom-header-wrapper mb-5">
        <h1 className="bottom-main-header">Bottom Collection</h1>
        <div className="bottom-header-decoration"></div>
      </div>
      
      {loading && (
        <div className="bottom-loading-container">
          <Spinner animation="border" variant="primary" className="bottom-spinner" />
          <p className="bottom-loading-text">Loading bottoms...</p>
        </div>
      )}

      {error && (
        <Alert variant="info" className="bottom-error-alert">
          {error}
        </Alert>
      )}

      <Row xs={1} sm={2} md={3} lg={4} className="bottom-grid g-4">
        {bottoms.map(product => (
          <Col key={product._id} className="bottom-col">
            <Card className="bottom-card h-100">
              <div className="bottom-img-container">
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000${product.image?.[0] || '/placeholder.jpg'}`}
                  alt={product.name}
                  className="bottom-img"
                />
                {product.discountedPrice < product.originalPrice && (
                  <div className="bottom-discount-badge">
                    {Math.round(100 - (product.discountedPrice / product.originalPrice * 100))}% OFF
                  </div>
                )}
              </div>
              <Card.Body className="bottom-card-body">
                <Card.Title className="bottom-name">{product.name}</Card.Title>
                <Card.Text className="bottom-category">{product.category}</Card.Text>
                <div className="bottom-card-footer">
                  <div className="bottom-price-container">
                    {product.discountedPrice < product.originalPrice && (
                      <span className="bottom-original-price">${product.originalPrice}</span>
                    )}
                    <span className="bottom-current-price">${product.discountedPrice}</span>
                  </div>
                  <div className="bottom-rating">
                    <FaStar className="bottom-rating-icon" />
                    <span className="bottom-rating-value">{product.rating || '4.5'}</span>
                  </div>
                  <button 
                    className="bottom-add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart className="bottom-cart-icon" />
                    Add to Cart
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}