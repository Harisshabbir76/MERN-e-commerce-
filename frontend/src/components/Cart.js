import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { Button, Table, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './heroSlider.css'; // We'll create this CSS file

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    clearCart
  } = useContext(CartContext);

  if (cartCount === 0) {
    return (
      <Container className="py-5 text-center empty-cart">
        <h2 className="mb-4">Your cart is empty</h2>
        <Link to="/catalog" className="btn btn-primary btn-lg">
          Continue Shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4 cart-container">
      <h2 className="mb-4">Your Cart ({cartCount} items)</h2>
      
      {/* Desktop Table View */}
      <div className="d-none d-md-block">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={`https://sublime-magic-production.up.railway.app${item.image[0]}`}
                      alt={item.name}
                      className="cart-item-img"
                    />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>${item.discountedPrice}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="quantity-input"
                  />
                </td>
                <td>${(item.discountedPrice * item.quantity).toFixed(2)}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(item._id)}
                    className="remove-btn"
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end">
                <strong>Total:</strong>
              </td>
              <td colSpan="2">
                <strong>${cartTotal.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="d-md-none">
        {cart.map((item) => (
          <Card key={item._id} className="mb-3 cart-item-card">
            <Card.Body>
              <Row>
                <Col xs={4}>
                  <img
                    src={`https://sublime-magic-production.up.railway.app${item.image[0]}`}
                    alt={item.name}
                    className="cart-item-img-mobile"
                  />
                </Col>
                <Col xs={8}>
                  <h5>{item.name}</h5>
                  <div className="mb-2">${item.discountedPrice}</div>
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">Qty:</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      className="quantity-input-mobile"
                    />
                  </div>
                  <div className="mb-2">
                    <strong>Total: ${(item.discountedPrice * item.quantity).toFixed(2)}</strong>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(item._id)}
                    className="w-100 remove-btn-mobile"
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
        <Card className="mb-3">
          <Card.Body className="text-center">
            <h5>Cart Total: ${cartTotal.toFixed(2)}</h5>
          </Card.Body>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="cart-actions mt-4">
        <Row>
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <Link to="/catalog" className="btn btn-outline-primary w-100">
              Continue Shopping
            </Link>
          </Col>
          <Col xs={12} md={6} className="d-flex flex-column flex-md-row justify-content-md-end">
            <Button 
              variant="outline-danger" 
              onClick={clearCart} 
              className="mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
            >
              Clear Cart
            </Button>
            <Link to="/checkout" className="btn btn-primary w-100 w-md-auto">
              Proceed to Checkout
            </Link>
          </Col>
        </Row>
      </div>
    </Container>
  );
}