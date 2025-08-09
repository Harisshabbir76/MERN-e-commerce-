import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { FaChevronRight } from 'react-icons/fa';
import '../../components/heroSlider.css';

import bottomImg from '../../images/bottom.jpeg';
import poloImg from '../../images/polo.jpeg';
import tshirtImg from '../../images/t-shirt.jpeg';
import watchImg from '../../images/watch.jpeg';
import BrowseImg from '../../images/browse.jpeg';

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
        const res = await axios.get('https://mern-e-commerce-f9ra.onrender.com/categories');
        
        if (!res || !res.data) {
          throw new Error('No data received from server');
        }

        let categories = [];
        
        if (Array.isArray(res.data)) {
          categories = res.data;
        } else if (Array.isArray(res.data.categories)) {
          categories = res.data.categories;
        } else if (Array.isArray(res.data.data)) {
          categories = res.data.data;
        } else if (Array.isArray(res.data.items)) {
          categories = res.data.items;
        } else {
          throw new Error('Invalid data format: Expected array');
        }

        setCategories(categories);
      } catch (err) {
        setError(err.message || 'Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryImage = (category) => {
    if (!category) return 'https://via.placeholder.com/300';
    
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
    return (
      categoryImages[normalizedCategory] ||
      categoryImages[category.toLowerCase()] ||
      'https://via.placeholder.com/300'
    );
  };

  // Function to render category card
  const renderCategoryCard = (category, isBrowseAll = false) => (
    <Col key={isBrowseAll ? 'browse-all' : category} xs={6} md={4} lg={3} className="mb-4">
      <Card 
        className="product-card h-100"
        onClick={() => 
          isBrowseAll 
            ? navigate('/category') 
            : navigate(`/category/${category.toString().replace(/\s+/g, '-')}`)
        }
      >
        <div className="product-image-container">
          <Card.Img
            variant="top"
            src={isBrowseAll ? BrowseImg : getCategoryImage(category)}
            alt={isBrowseAll ? 'Browse All' : category}
            className="product-img"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300';
            }}
          />
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="product-title text-capitalize">
            {isBrowseAll ? 'Browse All' : category}
            <FaChevronRight className="ms-2" style={{ color: '#3498db' }} />
          </Card.Title>
          {isBrowseAll && (
            <Card.Text className="text-muted product-category">
              See all categories
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container className="tshirt-products-page py-3 py-md-5">
      <div className="page-header-wrapper mb-4 mb-md-5">
        <h1 className="page-header">Shop by Category</h1>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading categories...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <>
          {/* Mobile view - show 2 categories per row */}
          <div className="d-block d-md-none">
            <Row className="g-3">
              {categories.slice(0, 3).map(category => renderCategoryCard(category))}
              {renderCategoryCard(null, true)}
            </Row>
          </div>
          
          {/* Tablet/Desktop view - show responsive columns */}
          <div className="d-none d-md-block">
            <Row className="g-4">
              {categories.slice(0, 4).map(category => renderCategoryCard(category))}
              {renderCategoryCard(null, true)}
            </Row>
          </div>
        </>
      )}
    </Container>
  );
}