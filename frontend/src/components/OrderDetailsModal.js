// components/OrderDetailsModal.js
import React from 'react';
import { Modal, Button, Badge, Table, Alert } from 'react-bootstrap';
import { FiUser, FiShoppingBag } from 'react-icons/fi';
import WhatsAppButton from './WhatsAppButton';

const OrderDetailsModal = ({ show, onHide, order }) => {
  if (!order) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5><FiUser className="me-2" />Customer Information</h5>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.email}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            </div>
          </div>
          <p><strong>Address:</strong> {order.address}, {order.city}, {order.zipCode}</p>
          
          <WhatsAppButton order={order} />
        </div>

        <div className="mb-4">
          <h5><FiShoppingBag className="me-2" />Order Items</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>${(product.price * product.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="text-end">
          <h5><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</h5>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <Badge bg={order.status === 'completed' ? 'success' : 
                    order.status === 'out-for-delivery' ? 'primary' : 'warning'}>
            {order.status}
          </Badge>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;