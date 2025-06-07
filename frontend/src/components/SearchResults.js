import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner, 
  Alert,
  Button,
  Badge,
  Stack
} from 'react-bootstrap';
import { FaShoppingCart, FaBoxOpen, FaStar } from 'react-icons/fa';
import { CartContext } from '../components/CartContext';
import './heroSlider.css'; // Create this CSS file

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://sublime-magic-production.up.railway.app/search?query=${query}`);
        setResults(response.data.map(product => ({
          ...product,
          stock: product.stock || Math.floor(Math.random() * 16) + 5,
          rating: product.rating || (Math.random() * 1 + 4).toFixed(1) // Default rating 4.0-5.0
        })));
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart({ 
        ...product, 
        quantity: 1 
      });
    }
  };

  const getProductImage = (product) => {
    if (!product?.image?.[0]) return '/placeholder.jpg';
    if (product.image[0].startsWith('http')) return product.image[0];
    return `https://sublime-magic-production.up.railway.app${product.image[0]}`;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Searching for "{query}"...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>Search Error</h5>
          <p className="mb-3">{error}</p>
          <Button 
            variant="outline-danger" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="search-results-container py-4">
      <div className="page-header-wrapper mb-4 mb-md-5 text-center">
        <h1 className="page-header">Search Results for "{query}"</h1>
        <div className="header-decoration mx-auto"></div>
      </div>

      {results.length === 0 ? (
        <Alert variant="info" className="text-center my-5">
          <h5>No Results Found</h5>
          <p className="mb-0">We couldn't find any products matching your search.</p>
        </Alert>
      ) : (
        <>
          {/* Mobile view - 2 products per row */}
          <div className="d-block d-md-none">
            <Row xs={2} className="g-3">
              {results.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onViewDetails={() => navigate(`/product/${product._id}`)}
                />
              ))}
            </Row>
          </div>
          
          {/* Tablet/Desktop view - responsive columns */}
          <div className="d-none d-md-block">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {results.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onViewDetails={() => navigate(`/product/${product._id}`)}
                />
              ))}
            </Row>
          </div>
        </>
      )}
    </Container>
  );
};

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const getProductImage = (product) => {
    if (!product?.image?.[0]) return '/placeholder.jpg';
    if (product.image[0].startsWith('http')) return product.image[0];
    return `https://sublime-magic-production.up.railway.app${product.image[0]}`;
  };

  return (
    <Col>
      <Card className="product-card h-100 border-0 shadow-sm">
        <div className="product-image-container">
          <Card.Img
            variant="top"
            src={getProductImage(product)}
            alt={product.name}
            onClick={onViewDetails}
            className="product-img"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
          {product.discountedPrice < product.price && (
            <div className="discount-badge">
              {Math.round(100 - (product.discountedPrice / product.price * 100)}% OFF
            </div>
          )}
          <Badge 
            bg={product.stock > 0 ? "success" : "danger"} 
            className="stock-badge"
          >
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="product-title" onClick={onViewDetails}>
            {product.name}
          </Card.Title>
          <Card.Text className="text-muted product-category">
            {product.category || 'Uncategorized'}
          </Card.Text>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="price">
                {product.discountedPrice < product.price && (
                  <span className="original-price text-muted text-decoration-line-through me-2">
                    ${product.price}
                  </span>
                )}
                <span className="current-price fw-bold">
                  ${product.discountedPrice || product.price}
                </span>
              </div>
              <div className="rating">
                <FaStar className="text-warning" />
                <span className="ms-1">{product.rating}</span>
              </div>
            </div>
            <button
              className={`add-to-cart-btn w-100 mt-2 ${product.stock <= 0 ? 'disabled' : ''}`}
              onClick={() => onAddToCart(product)}
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
};

export default SearchResults;