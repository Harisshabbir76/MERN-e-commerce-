import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import Rating from './Rating';
import axios from 'axios';

const ReviewsList = ({ reviews, productId, onReviewSubmit }) => {
  return (
    <div className="my-4">
      <h4>Customer Reviews</h4>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <ListGroup variant="flush">
          {reviews.map((review) => (
            <ListGroup.Item key={review._id} className="px-0">
              <Card className="border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{review.userName}</strong>
                      <small className="text-muted ms-2">{review.userEmail}</small>
                    </div>
                    <Rating value={review.rating} size={16} readOnly />
                  </div>
                  <Card.Text className="my-2">{review.comment}</Card.Text>
                  <small className="text-muted">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default ReviewsList;