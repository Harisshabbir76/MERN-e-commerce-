import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Form, 
  Button, 
  Alert,
  Card,
  Spinner,
  Row,
  Col
} from 'react-bootstrap';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '', 
    originalPrice: '',
    discountedPrice: '',
    category: '',
    stock: '',
    slug: ''
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      await axios.post('https://mern-e-commerce-yjbp.vercel.app/dashboard/add-product', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess("Product Added Successfully");
      setFormData({
        name: '',
        description: '', 
        originalPrice: '',
        discountedPrice: '',
        category: '',
        stock: '',
        slug: ''
      });
      setImages([]);
    } catch (err) {
      console.error(err);
      setError("Product Addition Failed: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/404');
          return;
        }
        
        const response = await axios.get('https://mern-e-commerce-yjbp.vercel.app/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.user?.email?.toLowerCase() === 'admin@gmail.com') {
          setIsAuthorized(true);
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm p-4 mx-auto" style={{ maxWidth: '800px' }}>
        <h1 className="text-center mb-4" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          width: '100%'
        }}>
          Add New Product
        </h1>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        {success && <Alert variant="success" className="text-center">{success}</Alert>}

        <Form onSubmit={handleProductSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category} 
                  onChange={handleChange} 
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description} 
              onChange={handleChange} 
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Original Price</Form.Label>
                <Form.Control
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice} 
                  onChange={handleChange} 
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Discounted Price</Form.Label>
                <Form.Control
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice} 
                  onChange={handleChange} 
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock} 
                  onChange={handleChange} 
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Product Slug</Form.Label>
                <Form.Control
                  type="text"
                  name="slug"
                  value={formData.slug} 
                  onChange={handleChange} 
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Product Images</Form.Label>
            <Form.Control
              type="file"
              multiple 
              onChange={(e) => setImages(Array.from(e.target.files))} 
              required
            />
            <Form.Text className="text-muted">
              Upload multiple images for the product
            </Form.Text>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '12px',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}
          >
            Add Product
          </Button>
        </Form>
      </Card>
    </Container>
  );
}