import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Stack,
  Form
} from 'react-bootstrap';
import { FaShoppingCart, FaBoxOpen } from 'react-icons/fa';
import { CartContext } from '../components/CartContext';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/catalog');
        setProducts(res.data.map(product => ({
          ...product,
          // Use actual stock value if provided, otherwise default to random stock (5-20)
          stock: product.stock !== undefined ? product.stock : Math.floor(Math.random() * 16) + 5
        })));
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart({ 
        ...product, 
        quantity: 1 
      });
    }
  };

  return (
    <Container className="my-5 py-4">
      {/* Header Section */}
      <Row className="mb-4 text-center">
        <Col>
          <h1 className="display-5 fw-bold mb-3">
            Our Products
          </h1>
          <p className="lead text-muted">
            Discover our premium products
          </p>
        </Col>
      </Row>

      {/* Content Section */}
      {loading ? (
        <Row className="justify-content-center my-5">
          <Col xs="auto">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-center">Loading products...</p>
          </Col>
        </Row>
      ) : error ? (
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map((product) => (
            <Col key={product._id}>
              <Card className="h-100 shadow-sm border-0 d-flex flex-column">
                <div 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/catalog/${product.slug}`)}
                  className="flex-grow-1"
                >
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000${product.image?.[0] || '/placeholder.jpg'}`}
                    alt={product.name}
                    style={{ 
                      height: '200px', 
                      objectFit: 'cover',
                      width: '100%'
                    }}
                    className="p-3"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Stack direction="horizontal" gap={2} className="mb-1">
                      <Card.Title className="mb-0 flex-grow-1">{product.name}</Card.Title>
                      <Badge 
                        bg={product.stock > 0 ? "success" : "danger"} 
                        className="align-self-start"
                      >
                        {product.stock > 0 ? `In Stock ` : "Out of Stock"}
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
                </div>
                <Card.Footer className="bg-white border-0 pt-0 pb-3">
                  {product.stock > 0 ? (
                    <Button 
                      variant="primary" 
                      className="w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
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
      )}
    </Container>
  );
}