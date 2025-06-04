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
        const res = await axios.get('sublime-magic-production.up.railway.app/categories');
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

  return (
    <Container className="category-container py-5">
      <div className="category-header-wrapper">
        <h1 className="category-main-header">Shop by Category</h1>
      </div>

      {loading && (
        <div className="category-loading-container">
          <Spinner animation="border" variant="primary" className="category-spinner" />
          <p className="category-loading-text">Loading categories...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="category-error-alert">
          Error loading categories: {error.message}
        </Alert>
      )}

      {!loading && !error && (
        <Row xs={1} sm={2} md={3} lg={5} className="category-grid g-4">
          {Array.isArray(categories) && categories.slice(0, 4).map((category, index) => (
            <Col key={index} className="category-col">
              <Card 
                className="category-card h-100"
                onClick={() => navigate(`/category/${category}`)}
                role="button"
              >
                <div className="category-img-container">
                  <Card.Img
                    variant="top"
                    src={getCategoryImage(category)}
                    alt={category}
                    className="category-img"
                  />
                </div>
                <Card.Body className="category-card-body">
                  <Card.Title className="category-name text-capitalize">
                    {category}
                    <FaChevronRight className="category-arrow ms-2" />
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}

          <Col className="category-col">
            <Card 
              className="category-card h-100"
              onClick={() => navigate('/category')}
              role="button"
            >
              <div className="category-img-container">
                <Card.Img
                  variant="top"
                  src={BrowseImg}
                  alt="Browse All"
                  className="category-img"
                />
              </div>
              <Card.Body className="category-card-body">
                <Card.Title className="category-name">
                  Browse All
                  <FaChevronRight className="category-arrow ms-2" />
                </Card.Title>
                <Card.Text className="category-subtext">See all categories</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}