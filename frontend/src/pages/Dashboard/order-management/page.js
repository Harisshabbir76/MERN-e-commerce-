import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Tab, 
  Tabs, 
  Table, 
  Button, 
  Badge, 
  Container,
  Card,
  Spinner,
  Modal
} from 'react-bootstrap';
import { 
  FiRefreshCw, 
  FiTruck, 
  FiCheckCircle
} from 'react-icons/fi';
import OrderDetailsModal from './OrderDetailsModal';
import ExportOrders from './ExportOrders';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://sublime-magic-production.up.railway.app/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.user.email.toLowerCase() === 'admin@gmail.com') {
          setIsAuthorized(true);
          fetchOrders();
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://sublime-magic-production.up.railway.app/allOrder');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`https://sublime-magic-production.up.railway.app/allOrder/${orderId}/status`, {
        status: newStatus
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const filteredOrders = {
    all: orders,
    delivery: orders.filter(order => order.status === 'out-for-delivery'),
    completed: orders.filter(order => order.status === 'completed')
  };

  if (authLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <div className="mt-3">Checking authorization...</div>
      </Container>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <div className="mt-3">Loading orders...</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="border-0 shadow">
        <Card.Body className="p-0">
          <div className="p-4 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Order Management</h2>
              <div className="d-flex align-items-center gap-3">
                <ExportOrders orders={orders} />
                <Button 
                  variant="primary"
                  onClick={fetchOrders}
                >
                  <FiRefreshCw className="me-2" /> Refresh
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="px-4 pt-3"
          >
            <Tab eventKey="all" title={
              <span className="d-flex align-items-center">
                All Orders
                {filteredOrders.all.length > 0 && (
                  <Badge pill bg="secondary" className="ms-2">
                    {filteredOrders.all.length}
                  </Badge>
                )}
              </span>
            }>
              <OrderTable 
                orders={filteredOrders.all} 
                onStatusUpdate={updateOrderStatus}
                onViewDetails={viewOrderDetails}
                showAll={true}
              />
            </Tab>
            <Tab eventKey="delivery" title={
              <span className="d-flex align-items-center">
                <FiTruck className="me-1" /> Delivery
                {filteredOrders.delivery.length > 0 && (
                  <Badge pill bg="primary" className="ms-2">
                    {filteredOrders.delivery.length}
                  </Badge>
                )}
              </span>
            }>
              <OrderTable 
                orders={filteredOrders.delivery} 
                onStatusUpdate={updateOrderStatus}
                onViewDetails={viewOrderDetails}
                showAll={false}
              />
            </Tab>
            <Tab eventKey="completed" title={
              <span className="d-flex align-items-center">
                <FiCheckCircle className="me-1" /> Completed
                {filteredOrders.completed.length > 0 && (
                  <Badge pill bg="success" className="ms-2">
                    {filteredOrders.completed.length}
                  </Badge>
                )}
              </span>
            }>
              <OrderTable 
                orders={filteredOrders.completed} 
                onStatusUpdate={updateOrderStatus}
                onViewDetails={viewOrderDetails}
                showAll={false}
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <OrderDetailsModal 
        show={showDetails} 
        onHide={() => setShowDetails(false)} 
        order={selectedOrder} 
      />
    </Container>
  );
};

const OrderTable = ({ orders, onStatusUpdate, onViewDetails, showAll }) => {
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
    <div className="p-4">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Products</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
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
                <td>
                  {order.products.slice(0, 2).map(p => (
                    <div key={p.productId}>
                      {p.name} (x{p.quantity})
                    </div>
                  ))}
                  {order.products.length > 2 && (
                    <div className="text-muted">
                      +{order.products.length - 2} more items
                    </div>
                  )}
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  {order.status === 'pending' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => onStatusUpdate(order._id, 'out-for-delivery')}
                      className="me-2 mb-2"
                    >
                      Mark as Out for Delivery
                    </Button>
                  )}
                  {order.status === 'out-for-delivery' && (
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => onStatusUpdate(order._id, 'completed')}
                      className="me-2 mb-2"
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
    </div>
  );
};

export default OrderManagement;