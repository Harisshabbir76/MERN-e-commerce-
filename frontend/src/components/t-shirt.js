import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../components/CartContext';
import './heroSlider.css';

export default function TshirtProducts() {
  const [tshirts, setTshirts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Get addToCart function from context

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('sublime-magic-production.up.railway.app/catalog');
        const filtered = res.data.filter(product => 
          product.category.toLowerCase() === 't-shirt'
        );
        if (filtered.length === 0) {
          throw new Error('No t-shirts found in our collection');
        }
        setTshirts(filtered);
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
    <Container className="tshirt-products-page py-5">
      <div className="page-header-wrapper mb-5">
        <h1 className="page-header">T-Shirt Collection</h1>
        <div className="header-decoration"></div>
      </div>
      
      {loading && (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading t-shirts...</p>
        </div>
      )}

      {error && (
        <Alert variant="info" className="text-center">
          {error}
        </Alert>
      )}

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {tshirts.map(product => (
          <Col key={product._id}>
            <Card className="product-card h-100 border-0 shadow-sm">
              <div className="product-image-container">
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000${product.image?.[0] || '/placeholder.jpg'}`}
                  alt={product.name}
                  className="product-img"
                />
                {product.discountedPrice < product.originalPrice && (
                  <div className="discount-badge">
                    {Math.round(100 - (product.discountedPrice / product.originalPrice * 100))}% OFF
                  </div>
                )}
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="product-title">{product.name}</Card.Title>
                <Card.Text className="text-muted product-category">{product.category}</Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="price">
                      {product.discountedPrice < product.originalPrice && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                      <span className="current-price">${product.discountedPrice}</span>
                    </div>
                  </div>
                  <button 
                    className="add-to-cart-btn w-100 mt-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart className="me-2" />
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