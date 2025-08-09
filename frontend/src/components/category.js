import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaChevronRight } from 'react-icons/fa';
import './heroSlider.css';

import bottomImg from '../images/bottom.jpeg';
import poloImg from '../images/polo.jpeg';
import tshirtImg from '../images/t-shirt.jpeg';
import watchImg from '../images/watch.jpeg';
import BrowseImg from '../images/browse.jpeg';

const categoryImages = {
  'bottom': bottomImg,
  'polo': poloImg,
  't-shirt': tshirtImg,
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
    return categoryImages[category] || 'https://via.placeholder.com/300';
  };

  // Function to render category card
  const renderCategoryCard = (category, isBrowseAll = false) => (
    <Col key={isBrowseAll ? 'browse-all' : category} className="mb-4">
      <Card 
        className="product-card h-100"
        onClick={() => 
          isBrowseAll 
            ? navigate('/category') 
            : navigate(`/category/${category.toString().replace(/\s+/g, '-')}`)
        }
        role="button"
      >
        <div className="product-image-container">
          <Card.Img
            variant="top"
            src={isBrowseAll ? BrowseImg : getCategoryImage(category)}
            alt={isBrowseAll ? 'Browse All' : category}
            className="product-img"
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
          Error loading categories: {error.message}
        </Alert>
      ) : (
        <>
          {/* Mobile view - show only 3 categories + browse all (2x2 grid) */}
          <div className="d-block d-md-none">
            <Row xs={2} className="g-3">
              {categories.slice(0, 3).map(category => renderCategoryCard(category))}
              {renderCategoryCard(null, true)}
            </Row>
          </div>
          
          {/* Tablet/Desktop view - show all categories with responsive columns */}
          <div className="d-none d-md-block">
            <Row xs={1} sm={2} md={3} lg={5} className="g-4">
              {categories.slice(0, 4).map(category => renderCategoryCard(category))}
              {renderCategoryCard(null, true)}
            </Row>
          </div>
        </>
      )}
    </Container>
  );
}