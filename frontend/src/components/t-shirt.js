import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../components/CartContext';
import './heroSlider.css';
import { useNavigate } from 'react-router-dom';

export default function TshirtProducts() {
  const [tshirts, setTshirts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://mern-e-commerce-production-10a6.up.railway.app/catalog');
        const data = res.data;

        console.log('API response:', data);

        let products = [];

        if (Array.isArray(data)) {
          products = data;
        } else if (data && Array.isArray(data.data)) {
          products = data.data;
        } else if (data && Array.isArray(data.products)) {
          products = data.products;
        } else {
          throw new Error('Unexpected API response: expected an array of products');
        }

        const filtered = products.filter(p =>
          p?.category?.toLowerCase()?.includes('t-shirt')
        );

        setTshirts(filtered);
        setError(filtered.length === 0 ? 'No t-shirts found' : null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load products');
        setTshirts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1,
    });
  };

  // Function to render product card
  const renderProductCard = (product) => (
    <Col key={product._id || product.id}>
      <Card className="product-card h-100 border-0 shadow-sm">
        <div className="product-image-container">
          <Card.Img
            onClick={() => navigate(`/catalog/${product.slug}`)}
            variant="top"
            src={
              product.image?.[0]
                ? `https://mern-e-commerce-yjbp.vercel.app${product.image[0]}`
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
              {Math.round(100 - (product.discountedPrice / product.originalPrice) * 100)}% OFF
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
  );

  return (
    <Container className="tshirt-products-page py-3 py-md-5">
      <div className="page-header-wrapper mb-4 mb-md-5">
        <h1 className="page-header">T-Shirt Collection</h1>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading t-shirts...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <>
          {/* Mobile view - show only 4 products (2x2 grid) */}
          <div className="d-block d-md-none">
            <Row xs={2} className="g-3">
              {tshirts.slice(0, 4).map(product => renderProductCard(product))}
            </Row>
          </div>
          
          {/* Tablet/Desktop view - show all products with responsive columns */}
          <div className="d-none d-md-block">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {tshirts.map(product => renderProductCard(product))}
            </Row>
          </div>
        </>
      )}
    </Container>
  );
}