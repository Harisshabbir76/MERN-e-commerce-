import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner, 
  Alert,
  Button,
  Stack
} from 'react-bootstrap';
import bottomImg from '../../images/bottom.jpeg';
import poloImg from '../../images/polo.jpeg';
import tshirtImg from '../../images/t-shirt.jpeg';
import watchImg from '../../images/watch.jpeg';

const categoryImages = {
  'bottom': bottomImg,
  'polo': poloImg,
  't-shirt': tshirtImg,
  't shirt': tshirtImg,
  'watch': watchImg
};

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/categories');
        setCategories(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryImage = (category) => {
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
    return categoryImages[normalizedCategory] || categoryImages[category.toLowerCase()] || 'https://via.placeholder.com/300';
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      {/* Hero Section */}
      <Stack gap={3} className="text-center mb-5">
        <h1 className="display-4 fw-bold" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          Shop by Category
        </h1>
        <p className="text-muted fs-5">Discover our premium collections</p>
      </Stack>
      
      {loading && (
        <Stack gap={2} className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" className="mx-auto" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted">Loading our collections...</p>
        </Stack>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          Error loading categories: {error.message}
        </Alert>
      )}

      <Row className="g-4">
        {categories.map((category, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3}>
            <Card 
              className="h-100 border-0 shadow-sm"
              onClick={() => navigate(`/category/${category.replace(/\s+/g, '-')}`)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                overflow: 'hidden',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(102,126,234,0.15)'
                }
              }}
            >
              <div 
                style={{
                  height: '200px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <Card.Img 
                  variant="top" 
                  src={getCategoryImage(category)} 
                  alt={category}
                  style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                    transition: 'transform 0.3s ease',
                    ':hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300';
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.4) 100%)'
                  }}
                />
              </div>
              <Card.Body className="text-center p-3">
                <Card.Title 
                  className="m-0 fw-semibold"
                  style={{
                    color: '#2d3748',
                    fontSize: '1.1rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {category.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  ).join(' ')}
                </Card.Title>
                <Button 
                  variant="outline-primary"
                  size="sm"
                  className="mt-2"
                  style={{
                    borderRadius: '20px',
                    padding: '0.25rem 1rem',
                    borderWidth: '1.5px',
                    backgroundColor: 'rgba(102,126,234,0.05)'
                  }}
                >
                  Shop Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}