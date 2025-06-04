import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Rating from './Rating';

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(
        'sublime-magic-production.up.railway.app/api/reviews',
        { 
          product: productId, 
          userName,
          userEmail,
          rating, 
          comment 
        }
      );

      setSuccess('Review submitted successfully');
      setError('');
      setRating(0);
      setComment('');
      setUserName('');
      setUserEmail('');
      onReviewSubmit(); // Refresh reviews
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error submitting review');
      setSuccess('');
    }
  };

  return (
    <div className="my-4 p-3 border rounded">
      <h4>Write a Review</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="userName" className="my-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="userEmail" className="my-3">
          <Form.Label>Your Email</Form.Label>
          <Form.Control
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="rating" className="my-3">
          <Form.Label>Rating</Form.Label>
          <Rating
            value={rating}
            onChange={(value) => setRating(value)}
            size={24}
            color="#f8e825"
          />
        </Form.Group>
        
        <Form.Group controlId="comment" className="my-3">
          <Form.Label>Review</Form.Label>
          <Form.Control
            as="textarea"
            row="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </Form.Group>
        
        <Button 
          type="submit" 
          variant="primary"
        >
          Submit Review
        </Button>
      </Form>
    </div>
  );
};

export default ReviewForm;