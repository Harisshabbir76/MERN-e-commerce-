import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner, 
  Alert,
  Stack,
  Badge,
  Button
} from 'react-bootstrap';
import { FaShoppingCart, FaBoxOpen } from 'react-icons/fa';
import { CartContext } from '../../../components/CartContext';

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
          // Use actual stock value if provided, otherwise default to random stock (5-20)
          stock: product.stock !== undefined ? product.stock : Math.floor(Math.random() * 16) + 5
        })));
      } catch (err) {
        if (err.response?.status === 404) {
          setProducts([]);
        } else {
          console.error('Error fetching products:', err);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart({ 
        ...product, 
        quantity: 1 
      });
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      {/* Category Header */}
      <Stack gap={3} className="text-center mb-5">
        <h1 className="display-5 fw-bold" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          {categoryName}
        </h1>
        <p className="text-muted fs-5">Browse our premium collection</p>
      </Stack>

      {/* Loading State */}
      {loading && (
        <Stack gap={2} className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" className="mx-auto" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted">Loading products...</p>
        </Stack>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="danger" className="text-center">
          Error loading products: {error.message}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <Alert variant="info" className="text-center">
          No products found in this category.
        </Alert>
      )}

      {/* Products Grid */}
      <Row className="g-4">
        {products.map((product) => (
          <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card 
              className="h-100 border-0 shadow-sm d-flex flex-column"
              style={{
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: product.stock > 0 ? 'pointer' : 'default',
                opacity: product.stock > 0 ? 1 : 0.7
              }}
              onClick={() => {
                if(product.stock > 0) navigate(`/category/${categoryName}/${product.slug}`)
              }}
            >
              <div style={{
                height: '200px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Card.Img 
                  variant="top" 
                  src={
                    product.image && product.image.length > 0
                      ? product.image[0].startsWith('http')
                        ? product.image[0]
                        : `https://sublime-magic-production.up.railway.app${product.image[0]}`
                      : 'https://via.placeholder.com/300'
                  }
                  alt={product.name}
                  style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: product.stock > 0 
                    ? 'linear-gradient(to bottom, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.2) 100%)'
                    : 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)'
                }} />
                {product.stock <= 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontWeight: 'bold'
                  }}>
                    OUT OF STOCK
                  </div>
                )}
              </div>
              <Card.Body className="p-3 d-flex flex-column">
                <Stack direction="horizontal" gap={2} className="mb-1">
                  <Card.Title className="mb-0 flex-grow-1" style={{ color: product.stock > 0 ? '#2d3748' : '#6c757d' }}>
                    {product.name}
                  </Card.Title>
                  <Badge 
                    bg={product.stock > 0 ? "success" : "danger"} 
                    className="align-self-start"
                  >
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </Stack>
                <Badge bg="secondary" className="mb-2 align-self-start">
                  {product.category}
                </Badge>
                
                <div className="mt-auto">
                  {product.discountedPrice < product.originalPrice && (
                    <Stack direction="horizontal" gap={2} className="mb-1">
                      <span className="text-decoration-line-through text-muted small">
                        {product.originalPrice} PKR
                      </span>
                      <Badge bg="danger" pill className="small">
                        {Math.round(100 - (product.discountedPrice / product.originalPrice * 100))}% OFF
                      </Badge>
                    </Stack>
                  )}
                  
                  <h5 className="mb-0 text-primary">
                    {product.discountedPrice} PKR
                  </h5>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0 pt-0 pb-3">
                {product.stock > 0 ? (
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <FaShoppingCart className="me-2" />
                    Add to Cart
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="w-100"
                    disabled
                  >
                    <FaBoxOpen className="me-2" />
                    Out of Stock
                  </Button>
                )}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
