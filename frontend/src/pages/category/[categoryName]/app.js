import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaBoxOpen, FaStar } from 'react-icons/fa';
import { CartContext } from '../../../components/CartContext';
import './App.css';

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryName) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`https://sublime-magic-production.up.railway.app/category/${encodeURIComponent(categoryName)}`);
        setProducts(res.data.map(product => ({
          ...product,
          stock: product.stock !== undefined ? product.stock : Math.floor(Math.random() * 16) + 5,
          rating: product.rating || (Math.random() * 1 + 4).toFixed(1) // Default rating 4.0-5.0
        })));
      } catch (err) {
        setError(err.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart({ 
        ...product, 
        quantity: 1 
      });
    }
  };

  // Function to render product card
  const renderProductCard = (product) => (
    <Col key={product._id} xs={6} md={4} lg={3} className="mb-4">
      <Card 
        className="product-card h-100"
        onClick={() => product.stock > 0 && navigate(`/category/${categoryName}/${product.slug}`)}
      >
        <div className="product-image-container">
          <Card.Img
            variant="top"
            src={
              product.image && product.image.length > 0
                ? product.image[0].startsWith('http')
                  ? product.image[0]
                  : `https://sublime-magic-production.up.railway.app${product.image[0]}`
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
          <Badge 
            bg={product.stock > 0 ? "success" : "danger"} 
            className="stock-badge"
          >
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
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
                <span className="ms-1">{product.rating}</span>
              </div>
            </div>
            <button
              className={`add-to-cart-btn w-100 mt-2 ${product.stock <= 0 ? 'disabled' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
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
        <h1 className="page-header">{categoryName}</h1>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading products...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : products.length === 0 ? (
        <Alert variant="info" className="text-center">
          No products found in this category.
        </Alert>
      ) : (
        <>
          {/* Mobile view - show 2 products per row */}
          <div className="d-block d-md-none">
            <Row className="g-3">
              {products.map(product => renderProductCard(product))}
            </Row>
          </div>
          
          {/* Tablet/Desktop view - show responsive columns */}
          <div className="d-none d-md-block">
            <Row className="g-4">
              {products.map(product => renderProductCard(product))}
            </Row>
          </div>
        </>
      )}
    </Container>
  );
}