import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Button, 
  Alert,
  Card,
  Spinner,
  Table,
  Badge,
  Tabs,
  Tab,
  Modal
} from 'react-bootstrap';
import { 
  FiRefreshCw, 
  FiTruck, 
  FiCheckCircle
} from 'react-icons/fi';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://sublime-magic-production.up.railway.app/allOrder', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://sublime-magic-production.up.railway.app/allOrder/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status.');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = {
    all: orders,
    delivery: orders.filter(order => order.status === 'out-for-delivery'),
    completed: orders.filter(order => order.status === 'completed')
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm p-4 mx-auto" style={{ maxWidth: '1200px' }}>
        <h1 className="text-center mb-4">Order Management</h1>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button 
            variant="primary"
            onClick={fetchOrders}
          >
            <FiRefreshCw className="me-2" /> Refresh Orders
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="all" title="All Orders">
            <OrderTable 
              orders={filteredOrders.all} 
              onStatusUpdate={updateOrderStatus}
              onViewDetails={viewOrderDetails}
            />
          </Tab>
          <Tab eventKey="delivery" title="Delivery">
            <OrderTable 
              orders={filteredOrders.delivery} 
              onStatusUpdate={updateOrderStatus}
              onViewDetails={viewOrderDetails}
            />
          </Tab>
          <Tab eventKey="completed" title="Completed">
            <OrderTable 
              orders={filteredOrders.completed} 
              onStatusUpdate={updateOrderStatus}
              onViewDetails={viewOrderDetails}
            />
          </Tab>
        </Tabs>
      </Card>

      <OrderDetailsModal 
        show={showDetails} 
        onHide={() => setShowDetails(false)} 
        order={selectedOrder} 
      />
    </Container>
  );
};

const OrderTable = ({ orders, onStatusUpdate, onViewDetails }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'out-for-delivery':
        return <Badge bg="primary">Out for Delivery</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center py-4">
              No orders found
            </td>
          </tr>
        ) : (
          orders.map(order => (
            <tr key={order._id}>
              <td>
                <Button 
                  variant="link" 
                  onClick={() => onViewDetails(order)}
                >
                  {order._id.substring(0, 8)}...
                </Button>
              </td>
              <td>{order.customerName}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td>
                {order.status === 'pending' && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => onStatusUpdate(order._id, 'out-for-delivery')}
                    className="me-2"
                  >
                    Mark as Out for Delivery
                  </Button>
                )}
                {order.status === 'out-for-delivery' && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => onStatusUpdate(order._id, 'completed')}
                    className="me-2"
                  >
                    Mark as Completed
                  </Button>
                )}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onViewDetails(order)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

const OrderDetailsModal = ({ show, onHide, order }) => {
  if (!order) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h5>Order ID: {order._id}</h5>
          <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
        </div>
        
        <div className="mb-3">
          <h6>Customer Information</h6>
          <p>Name: {order.customerName}</p>
          <p>Email: {order.email}</p>
          <p>Phone: {order.phone}</p>
          <p>Address: {order.address}, {order.city}, {order.zipCode}</p>
        </div>
        
        <div className="mb-3">
          <h6>Products</h6>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>${product.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        <div>
          <h6>Order Summary</h6>
          <p>Subtotal: ${order.totalAmount.toFixed(2)}</p>
          <p>Status: <Badge bg={
            order.status === 'completed' ? 'success' : 
            order.status === 'out-for-delivery' ? 'primary' : 'warning'
          }>
            {order.status}
          </Badge></p>
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

export default OrderManagement;