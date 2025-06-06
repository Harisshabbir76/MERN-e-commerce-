import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import './heroSlider.css';

export default function BottomProducts() {
  const [bottoms, setBottoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    
    // Ensure URLs are properly formatted
    if (imagePath.startsWith('http')) {
      // Force HTTPS if URL is insecure
      return imagePath.replace(/^http:/, 'https:');
    }
    
    // Handle relative paths
    if (imagePath.startsWith('/')) {
      return `https://sublime-magic-production.up.railway.app${imagePath}`;
    }
    
    return '/placeholder.jpg';
  };

  const ProductImage = ({ src, alt, onClick }) => {
    const [imgSrc, setImgSrc] = useState(getImageUrl(src));

    return (
      <Card.Img
        variant="top"
        onClick={onClick}
        src={imgSrc}
        alt={alt}
        className="product-img"
        onError={() => {
          console.warn(`Failed to load image: ${src}`);
          setImgSrc('/placeholder.jpg');
        }}
      />
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://sublime-magic-production.up.railway.app/catalog', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Full API response:', res);

        if (!res.data) {
          throw new Error('No data received from API');
        }

        const data = Array.isArray(res.data) 
          ? res.data 
          : res.data.data || res.data.products || [];

        console.log('Processed products:', data);

        const filtered = data.filter(product => {
          const category = product.category?.toLowerCase() || '';
          return category.includes('bottom') || 
                 category.includes('pant') || 
                 category.includes('trouser');
        });

        if (filtered.length === 0) {
          console.warn('Available categories:', 
            [...new Set(data.map(p => p.category?.toLowerCase()))]);
          setError('No bottoms found. Check console for available categories.');
        } else {
          setBottoms(filtered);
        }
      } catch (err) {
        console.error('API Error:', err.response || err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch products');
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
      quantity: 1
    });
  };

  return (
    <Container className="bottom-products-container py-5">
      <div className="bottom-header-wrapper mb-5">
        <h1 className="bottom-main-header">Bottom Collection</h1>
        <div className="bottom-header-decoration"></div>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading bottoms...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
          <div className="mt-2">
            <small>Check browser console for more details</small>
          </div>
        </Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {bottoms.map(product => (
            <Col key={product._id || product.id}>
              <Card className="product-card h-100 border-0 shadow-sm">
                <div className="product-image-container">
                  <ProductImage
                    src={product.image?.[0]}
                    alt={product.name}
                    onClick={() => navigate(`/product/${product.slug || product._id}`)}
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
                            Rs {product.originalPrice}
                          </span>
                        )}
                        <span className="current-price fw-bold">
                          Rs {product.discountedPrice || product.price}
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