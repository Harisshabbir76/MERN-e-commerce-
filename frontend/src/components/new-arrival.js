import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { FaShoppingCart, FaBoxOpen, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { CartContext } from '../components/CartContext';
import FilterComponent from './Filter';
import './heroSlider.css';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get('https://sublime-magic-production.up.railway.app/new-arrival');
        const productsWithDefaults = response.data.map(product => ({
          ...product,
          stock: product.stock !== undefined ? product.stock : Math.floor(Math.random() * 16) + 5,
          rating: product.rating || (Math.random() * 1 + 4).toFixed(1)
        }));
        setProducts(productsWithDefaults);
        setFilteredProducts(productsWithDefaults);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load new arrivals');
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const sortProducts = () => {
      let sorted = [...products];
      
      switch (sortOption) {
        case 'price-high-low':
          sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
          break;
        case 'price-low-high':
          sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
          break;
        case 'rating-high':
          sorted.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
      
      setFilteredProducts(sorted);
    };

    sortProducts();
  }, [sortOption, products]);

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

  return (
    <Container className="new-arrivals-container py-4">
      <div className="page-header-wrapper mb-4 mb-md-5 text-center">
        <h1 className="page-header">
          <FaCalendarAlt className="me-2" />
          New Arrivals
        </h1>
        
        <p className="lead text-muted mt-3">
          Discover our latest products added in the last 30 days
        </p>
      </div>

      <FilterComponent 
        sortOption={sortOption} 
        onSortChange={setSortOption} 
      />

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading new arrivals...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="info" className="text-center">
          No new arrivals found in the last 30 days
        </Alert>
      ) : (
        <>
          <div className="d-block d-md-none">
            <Row xs={2} className="g-3">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onViewDetails={() => navigate(`/catalog/${product.slug}`)}
                />
              ))}
            </Row>
          </div>
          
          <div className="d-none d-md-block">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onViewDetails={() => navigate(`/catalog/${product.slug}`)}
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
          {product.discountedPrice < product.originalPrice && (
            <div className="discount-badge">
              {Math.round(100 - (product.discountedPrice / product.originalPrice * 100))}% OFF
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
                {product.discountedPrice < product.originalPrice && (
                  <span className="original-price text-muted text-decoration-line-through me-2">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="current-price fw-bold">
                  ${product.discountedPrice}
                </span>
              </div>
              <div className="rating">
                <FaStar className="text-warning" />
                <span className="ms-1">{product.rating}</span>
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
};

export default NewArrivals;