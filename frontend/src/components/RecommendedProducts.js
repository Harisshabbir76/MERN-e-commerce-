// src/components/RecommendedProducts.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Card, Spinner } from 'react-bootstrap';

const RecommendedProducts = ({ currentProductId, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/category/${encodeURIComponent(category)}`);
        // Filter out the current product and limit to 4 recommendations
        const filteredProducts = res.data
          .filter(product => product._id !== currentProductId)
          .slice(0, 4);
        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching recommended products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchRecommendedProducts();
    }
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show anything if no recommendations
  }

  return (
    <div className="mt-5">
      <h4 className="mb-4">You may also like</h4>
      <Row className="g-4">
        {products.map((product) => (
          <Col key={product._id} xs={6} md={3}>
            <Card as={Link} to={`/product/${product.slug}`} className="h-100 text-decoration-none">
              <Card.Img
                variant="top"
                src={`http://localhost:5000${product.image[0]}`}
                alt={product.name}
                style={{
                  height: '180px',
                  objectFit: 'cover'
                }}
              />
              <Card.Body>
                <Card.Title className="fs-6">{product.name}</Card.Title>
                <div>
                  <span className="text-danger fw-bold">{product.discountedPrice} PKR</span>
                  {product.discountedPrice < product.originalPrice && (
                    <del className="text-muted ms-2">{product.originalPrice} PKR</del>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RecommendedProducts;