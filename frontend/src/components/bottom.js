import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom'; // Ensure navigation works
import './heroSlider.css';

export default function BottomProducts() {
  const [bottoms, setBottoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate(); // Used for product detail navigation

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://sublime-magic-production.up.railway.app/catalog');
        const data = res.data;

        // Try all possible shapes
        const products = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : Array.isArray(data.data)
          ? data.data
          : [];

        console.log('Fetched products:', products);

        const filtered = products.filter(product =>
          product.category?.toLowerCase().trim().includes('bottom')
        );

        console.log('Filtered bottoms:', filtered);

        if (filtered.length === 0) {
          throw new Error('No bottoms found in our collection');
        }

        setBottoms(filtered);
        setError(null); // clear error if found
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1
    });
  };

  return (
    <Container className="bottom-products-container py-5">
      <div className="bottom-header-wrapper mb-5">
        <h1 className="bottom-main-header">Bottom Collection</h1>
        <div className="bottom-header-decoration"></div>
      </div>

      {loading && (
        <div className="bottom-loading-container text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading bottoms...</p>
        </div>
      )}

      {error && (
        <Alert variant="info" className="text-center">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {bottoms.map(product => (
            <Col key={product._id || product.id}>
              <Card className="product-card h-100 border-0 shadow-sm">
                <div className="product-image-container">
                  <Card.Img
                    onClick={() => navigate(`/product/${product.slug}`)}
                    variant="top"
                    src={
                      product.image?.[0]
                        ? `https://sublime-magic-production.up.railway.app${product.image[0]}`
                        : '/placeholder.jpg'
                    }
                    alt={product.name}
                    className="product-img"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  {product.discountedPrice < product.originalPrice && (
                    <div className="discount-badge">
                      {Math.round(
                        100 - (product.discountedPrice / product.originalPrice) * 100
                      )}
                      % OFF
                    </div>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="product-title">{product.name}</Card.Title>
                  <Card.Text className="text-muted product-category">
                    {product.category || 'Uncategorized'}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="price">
                        {product.discountedPrice < product.originalPrice && (
                          <span className="original-price text-muted text-decoration-line-through me-2">
                            ${product.originalPrice}
                          </span>
                        )}
                        <span className="current-price fw-bold">
                          ${product.discountedPrice || product.price}
                        </span>
                      </div>
                      <div className="rating">
                        <FaStar className="text-warning" />
                        <span className="ms-1">{product.rating || '4.5'}</span>
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
      )}
    </Container>
  );
}
