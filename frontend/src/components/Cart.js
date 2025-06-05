// src/components/Cart.js
import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { Button, Table, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
      <Container className="py-5 text-center">
        <h2>Your cart is empty</h2>
        <Link to="/catalog" className="btn btn-primary">
          Continue Shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2>Your Cart ({cartCount} items)</h2>
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
                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
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
                  style={{ width: '60px' }}
                />
              </td>
              <td>${(item.discountedPrice * item.quantity).toFixed(2)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item._id)}
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
      <div className="d-flex justify-content-between mt-4">
        <Link to="/catalog" className="btn btn-outline-primary">
          Continue Shopping
        </Link>
        <div>
          <Button variant="outline-danger" onClick={clearCart} className="me-2">
            Clear Cart
          </Button>
          <Link to="/checkout" className="btn btn-primary">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </Container>
  );
}