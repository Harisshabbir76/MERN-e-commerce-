import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Modal, Row, Col, Alert } from 'react-bootstrap';
import { CartContext } from './CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const { cart, cartTotal, clearCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
    } else {
      setProducts(cart);
    }
  }, [location.state, cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (location.state?.products) {
      setProducts(prev => prev.map(item => 
        item._id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderProducts = products.map(item => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.discountedPrice
      }));

      const totalAmount = products.reduce(
        (total, item) => total + (item.discountedPrice * item.quantity),
        0
      );

      const orderData = {
        ...formData,
        products: orderProducts,
        totalAmount,
        paymentMethod: 'cash-on-delivery'
      };

      const response = await axios.post('https://mern-e-commerce-production-10a6.up.railway.app/orders', orderData);
      
      if (response.status === 201) {
        setShowSuccess(true);
        if (!location.state?.products) {
          clearCart();
        }
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
    navigate('/catalog');
  };

  if (products.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">
          <h2>Your cart is empty</h2>
          <Button variant="primary" onClick={() => navigate('/catalog')} className="mt-3">
            Continue Shopping
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Checkout</h2>
      <Row>
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Shipping Information</h4>
            
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mb-3 mt-4">Payment Method</h4>
            <div className="mb-4 p-3 bg-light rounded">
              <Form.Check
                type="radio"
                id="cash-on-delivery"
                label="Cash on Delivery"
                name="paymentMethod"
                value="cash-on-delivery"
                checked
                readOnly
              />
              <small className="text-muted">Pay with cash upon delivery</small>
            </div>

            <Button variant="primary" type="submit" className="w-100 py-3">
              Place Order
            </Button>
          </Form>
        </Col>

        <Col md={4}>
          <div className="bg-light p-4 rounded">
            <h4 className="mb-3">Order Summary</h4>
            <ul className="list-unstyled">
              {products.map(item => (
                <li key={item._id} className="d-flex justify-content-between mb-3">
                  <div>
                    <p className="mb-1">{item.name}</p>
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                        style={{ width: '60px', margin: '0 5px' }}
                        className="text-center"
                      />
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <span>{(item.discountedPrice * item.quantity).toFixed(2)} PKR</span>
                </li>
              ))}
            </ul>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>
                {products.reduce(
                  (total, item) => total + (item.discountedPrice * item.quantity),
                  0
                ).toFixed(2)} PKR
              </span>
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showSuccess} onHide={handleContinueShopping} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Confirmed!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="#28a745"
              className="bi bi-check-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          <h5 className="mb-3">Thank you for your order!</h5>
          <p>Your order will be delivered in 5 business days.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={handleContinueShopping}>
            Continue Shopping
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}