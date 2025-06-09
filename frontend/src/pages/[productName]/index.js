import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Spinner, 
  Alert,
  Button,
  Badge,
  Card,
  Stack,
  Form,
  ListGroup
} from 'react-bootstrap';
import { useCart } from '../../components/CartContext';
import RecommendedProducts from '../../components/RecommendedProducts';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    userEmail: '',
    rating: 0,
    comment: ''
  });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://sublime-magic-production.up.railway.app/product/${slug}`);
        setProduct(res.data);
        setReviews(res.data.reviews || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: quantity
    });
  };

  const handleOrderNow = () => {
    navigate('/checkout', {
      state: {
        products: [{
          ...product,
          quantity: quantity
        }]
      }
    });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://sublime-magic-production.up.railway.app/api/reviews', {
        product: product._id,
        ...reviewForm
      });

      // Refresh product and reviews
      const res = await axios.get(`https://sublime-magic-production.up.railway.app/product/${slug}`);
      setProduct(res.data);
      setReviews(res.data.reviews);
      
      setReviewSuccess('Review submitted successfully!');
      setReviewError('');
      setReviewForm({
        userName: '',
        userEmail: '',
        rating: 0,
        comment: ''
      });
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
      setReviewSuccess('');
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading product details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Error loading product: {error.message}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="info">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* Product Images */}
        <Col md={6}>
          <Row xs={2} md={3} className="g-3">
            {product.image.map((img, index) => {
              const imgUrl = img.startsWith('http') ? img : `https://sublime-magic-production.up.railway.app${img}`;
              return (
                <Col key={index}>
                  <Card
                    className={`h-100 cursor-pointer border ${index === selectedImage ? 'border-primary' : 'border-light'}`}
                    onClick={() => setSelectedImage(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Img
                      src={imgUrl}
                      alt={`${product.name} image ${index + 1}`}
                      style={{ objectFit: 'cover', height: '150px', width: '100%' }}
                      onError={e => { e.target.src = '/placeholder.jpg'; }}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>

          <Card className="mt-4 border-0 shadow-sm">
            <Card.Img
              src={product.image[selectedImage].startsWith('http') ? product.image[selectedImage] : `https://sublime-magic-production.up.railway.app${product.image[selectedImage]}`}
              alt={`${product.name} main image`}
              style={{
                objectFit: 'contain',
                height: '400px',
                width: '100%',
                backgroundColor: '#f8f9fa'
              }}
              onError={e => { e.target.src = '/placeholder.jpg'; }}
            />
          </Card>
        </Col>

        {/* Product Details */}
        <Col md={6}>
          <Stack gap={3}>
            <div>
              <Badge bg="light" text="dark" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="display-5 fw-bold">{product.name}</h1>
              {product.stock > 0 ? (
                <Badge bg="success" className="mb-3">
                  In Stock 
                </Badge>
              ) : (
                <Badge bg="danger" className="mb-3">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div>
              <p className="text-muted">{product.description}</p>
            </div>

            <div className="d-flex align-items-center gap-3">
              <h3 className="text-danger mb-0">
                {product.discountedPrice} PKR
              </h3>
              {product.discountedPrice < product.originalPrice && (
                <del className="text-muted">{product.originalPrice} PKR</del>
              )}
            </div>

            {/* Rating Display */}
            <div className="d-flex align-items-center mt-2">
              <div className="d-flex me-2">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    style={{ 
                      color: product.averageRating > i ? '#f8e825' : '#ccc',
                      fontSize: '1.2rem'
                    }}
                  >
                    {product.averageRating > i ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-muted">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <Form.Group controlId="quantity" className="mt-3">
                <Form.Label>Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  style={{ width: '100px' }}
                />
                <Form.Text className="text-muted">
                  Max {product.stock} available
                </Form.Text>
              </Form.Group>
            )}

            <Stack direction="horizontal" gap={3} className="mt-4">
              {product.stock > 0 ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleOrderNow}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      flex: 1
                    }}
                  >
                    Order Now
                  </Button>
                 <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() => {
                    handleAddToCart();
                    // Optional: You can also track here if not using automatic data-attribute tracking
                  }}
                  style={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    flex: 1
                  }}
                  data-track="add_to_cart"
                  data-track-meta={JSON.stringify({
                    product_id: product.id,
                    price: product.price,
                    name: product.name,
                    category: product.category,
                    
                  })}
                >
                  Add to Cart
                </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  disabled
                  style={{ width: '100%' }}
                >
                  Currently Unavailable
                </Button>
              )}
            </Stack>
          </Stack>
        </Col>
      </Row>

      {/* Reviews Section */}
      <Row className="mt-5">
        <Col md={12}>
          <Card className="mb-4">
            <Card.Body>
              <h4>Write a Review</h4>
              {reviewError && <Alert variant="danger">{reviewError}</Alert>}
              {reviewSuccess && <Alert variant="success">{reviewSuccess}</Alert>}
              
              <Form onSubmit={handleReviewSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="userName"
                        value={reviewForm.userName}
                        onChange={handleReviewChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="userEmail"
                        value={reviewForm.userEmail}
                        onChange={handleReviewChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <div className="d-flex">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        style={{ 
                          cursor: 'pointer',
                          color: reviewForm.rating > i ? '#f8e825' : '#ccc',
                          fontSize: '1.5rem'
                        }}
                        onClick={() => handleRatingChange(i + 1)}
                      >
                        {reviewForm.rating > i ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Review</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="comment"
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    required
                  />
                </Form.Group>
                
                <Button type="submit" variant="primary">
                  Submit Review
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          {/* Reviews List */}
          <h4>Customer Reviews</h4>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            <ListGroup variant="flush">
              {reviews.map((review) => (
                <ListGroup.Item key={review._id} className="px-0 mb-3">
                  <Card className="border-0">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <strong>{review.userName}</strong>
                          <small className="text-muted ms-2">{review.userEmail}</small>
                        </div>
                        <div className="d-flex">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              style={{ 
                                color: review.rating > i ? '#f8e825' : '#ccc',
                                fontSize: '1.2rem'
                              }}
                            >
                              {review.rating > i ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Card.Text>{review.comment}</Card.Text>
                      <small className="text-muted">
                        Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      {/* Recommended Products Section */}
      <Row className="mt-5">
        <Col>
          <RecommendedProducts 
          currentProductId={product._id} 
          category={product.category}
        />
        </Col>
      </Row>
    </Container>
  );
}
