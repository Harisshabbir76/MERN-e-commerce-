import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaShoppingCart, FaBoxOpen } from 'react-icons/fa';
import { useCart } from '../components/CartContext';
import './heroSlider.css';
import { useNavigate } from 'react-router-dom';

export default function BottomProducts() {
  const [bottoms, setBottoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://sublime-magic-production.up.railway.app/catalog');
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
          p?.category?.toLowerCase()?.includes('bottom')
        );

        setBottoms(filtered);
        setError(filtered.length === 0 ? 'No bottoms found' : null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load products');
        setBottoms([]);
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

  const renderProductCard = (product) => (
    <Col key={product._id || product.id}>
      <Card className="product-card h-100 border-0 shadow-sm">
        <div className="product-image-container">
          <Card.Img
            onClick={() => navigate(`/catalog/${product.slug}`)}
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
              className={`add-to-cart-btn w-100 mt-2 ${product.stock <= 0 ? 'disabled' : ''}`}
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? (
                <>
                  <FaShoppingCart className="me-2" />
                  Add to Cart
                </>
              ) : (
                <>
                  <FaBoxOpen className="me-2" />
                  Out of Stock
                </>
              )}
            </button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container className="tshirt-products-page py-3 py-md-5">
      <div className="page-header-wrapper mb-4 mb-md-5">
        <h1 className="page-header">Bottom Collection</h1>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading bottoms...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <>
          <div className="d-block d-md-none">
            <Row xs={2} className="g-3">
              {bottoms.slice(0, 4).map(product => renderProductCard(product))}
            </Row>
          </div>
          
          <div className="d-none d-md-block">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {bottoms.map(product => renderProductCard(product))}
            </Row>
          </div>
        </>
      )}
    </Container>
  );
}