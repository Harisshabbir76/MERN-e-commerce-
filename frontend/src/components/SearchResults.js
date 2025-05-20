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
import { FaShoppingCart, FaBoxOpen } from 'react-icons/fa';
import { CartContext } from '../components/CartContext';

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
        const response = await axios.get(`http://localhost:5000/search?query=${query}`);
        setResults(response.data.map(product => ({
          ...product,
          stock: product.stock || Math.floor(Math.random() * 16) + 5
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

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart({ 
        ...product, 
        quantity: 1 
      });
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Searching for "{query}"...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
          <Button 
            variant="outline-danger" 
            className="mt-2" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 py-4">
      <h1 className="display-5 fw-bold mb-4" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
      }}>
        Search Results for "{query}"
      </h1>

      {results.length === 0 ? (
        <Alert variant="info" className="text-center my-5">
          No products found matching your search.
        </Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {results.map((product) => (
            <Col key={product._id}>
              <Card className="h-100 shadow-sm border-0 d-flex flex-column">
                <div 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="flex-grow-1"
                >
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000${product.image?.[0] || '/placeholder.jpg'}`}
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
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </Stack>
                    <Badge bg="secondary" className="mb-2 align-self-start">
                      {product.category}
                    </Badge>
                    
                    <div className="mt-auto">
                      {product.discountedPrice < product.price && (
                        <Stack direction="horizontal" gap={2} className="mb-1">
                          <span className="text-decoration-line-through text-muted">
                            ${product.price}
                          </span>
                          <Badge bg="danger" pill>
                            {Math.round(100 - (product.discountedPrice / product.price * 100))}% OFF
                          </Badge>
                        </Stack>
                      )}
                      
                      <h5 className="mb-0 text-primary">
                        ${product.discountedPrice || product.price}
                      </h5>
                    </div>
                  </Card.Body>
                </div>
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
      )}
    </Container>
  );
};

export default SearchResults;