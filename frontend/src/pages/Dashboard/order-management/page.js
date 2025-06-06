import React, { useState, useEffect } from 'react';
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
  Tab
} from 'react-bootstrap';
import { 
  FiRefreshCw, 
  FiTruck, 
  FiCheckCircle
} from 'react-icons/fi';
import OrderDetailsModal from './OrderDetailsModal';
import ExportOrders from './ExportOrders';

const OrderManagement = () => {
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
      await axios.put(`https://sublime-magic-production.up.railway.app/allOrder/${orderId}/status`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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
        <h1 className="text-center mb-4" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          width: '100%'
        }}>
          Order Management
        </h1>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <ExportOrders orders={orders} />
            <Button 
              variant="primary"
              onClick={fetchOrders}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                padding: '8px 16px',
                fontWeight: '500'
              }}
            >
              <FiRefreshCw className="me-2" /> Refresh Orders
            </Button>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab 
            eventKey="all" 
            title={
              <span className="d-flex align-items-center">
                All Orders
                {filteredOrders.all.length > 0 && (
                  <Badge pill bg="secondary" className="ms-2">
                    {filteredOrders.all.length}
                  </Badge>
                )}
              </span>
            }
          >
            <OrderTable 
              orders={filteredOrders.all} 
              onStatusUpdate={updateOrderStatus}
              onViewDetails={viewOrderDetails}
              showAll={true}
              loading={loading}
            />
          </Tab>
          <Tab 
            eventKey="delivery" 
            title={
              <span className="d-flex align-items-center">
                <FiTruck className="me-1" /> Delivery
                {filteredOrders.delivery.length > 0 && (
                  <Badge pill bg="primary" className="ms-2">
                    {filteredOrders.delivery.length}
                  </Badge>
                )}
              </span>
            }
          >
            <OrderTable 
              orders={filteredOrders.delivery} 
              onStatusUpdate={updateOrderStatus}
              onViewDetails={viewOrderDetails}
              showAll={false}
              loading={loading}
            />
          </Tab>
          <Tab 
            eventKey="completed" 
            title={
              <span className="d-flex align-items-center">
                <FiCheckCircle className="me-1" /> Completed
                {filteredOrders.completed.length > 0 && (
                  <Badge pill bg="success" className="ms-2">
                    {filteredOrders.completed.length}
                  </Badge>
                )}
              </span>
            }
          >
            <OrderTable 
              orders={filteredOrders.completed} 
              onStatusUpdate={updateOrderStatus}
              onViewDetails={viewOrderDetails}
              showAll={false}
              loading={loading}
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

const OrderTable = ({ orders, onStatusUpdate, onViewDetails, showAll, loading }) => {
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

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  return (
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
                  className="p-0 text-primary"
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
                <div className="d-flex flex-wrap gap-2">
                  {order.status === 'pending' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => onStatusUpdate(order._id, 'out-for-delivery')}
                    >
                      Mark as Out for Delivery
                    </Button>
                  )}
                  {order.status === 'out-for-delivery' && (
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => onStatusUpdate(order._id, 'completed')}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onViewDetails(order)}
                  >
                    View Details
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default OrderManagement;