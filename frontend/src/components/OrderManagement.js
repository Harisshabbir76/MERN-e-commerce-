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
  Modal,
  Dropdown,
  Stack
} from 'react-bootstrap';
import { 
  FiRefreshCw, 
  FiTruck, 
  FiCheckCircle, 
  FiUser, 
  FiShoppingBag,
  FiDownload,
  FiFileText,
  FiChevronDown
} from 'react-icons/fi';
import * as XLSX from 'xlsx';
import OrderDetailsModal from './OrderDetailsModal';
import ExportOrders from './ExportOrders';
import './heroSlider.css'; // Create this CSS file

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filteredCounts, setFilteredCounts] = useState({
    all: 0,
    delivery: 0,
    completed: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/404');
          return;
        }

        const response = await axios.get('https://mern-e-commerce-f9ra.onrender.com/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.user.email === 'Admin@gmail.com') {
          setIsAuthorized(true);
          fetchOrders();
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/404');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://mern-e-commerce-f9ra.onrender.com/allOrder');
      setOrders(response.data);
      
      // Calculate counts for each tab
      const deliveryCount = response.data.filter(order => order.status === 'out-for-delivery').length;
      const completedCount = response.data.filter(order => order.status === 'completed').length;
      
      setFilteredCounts({
        all: response.data.length,
        delivery: deliveryCount,
        completed: completedCount
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`https://mern-e-commerce-f9ra.onrender.com/allOrder/${orderId}/status`, {
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
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Verifying access...</span>
      </Container>
    );
  }

  if (!isAuthorized) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <Container className="order-management-container py-4">
      <Card className="border-0 shadow-lg">
        <Card.Header className="bg-primary text-white py-3">
          <Stack direction="horizontal" gap={3} className="justify-content-between align-items-center flex-wrap">
            <h2 className="mb-0">
              <FiShoppingBag className="me-2" />
              Order Management
            </h2>
            <Stack direction="horizontal" gap={2}>
              <ExportOrders orders={orders} />
              <Button 
                variant="light" 
                onClick={fetchOrders}
                disabled={loading}
                className="d-flex align-items-center"
              >
                <FiRefreshCw className={`me-2 ${loading ? 'spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Stack>
          </Stack>
        </Card.Header>
        
        <Card.Body className="p-0">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="px-3 pt-3 mb-0"
            fill
          >
            <Tab 
              eventKey="all" 
              title={
                <TabTitle 
                  icon={null}
                  text="All Orders"
                  count={filteredCounts.all}
                  active={activeTab === 'all'}
                />
              }
            >
              <OrderTable 
                orders={filteredOrders.all} 
                onStatusUpdate={updateOrderStatus}
                onViewDetails={viewOrderDetails}
                loading={loading}
                emptyMessage="No orders found in the system"
              />
            </Tab>
            <Tab 
              eventKey="delivery" 
              title={
                <TabTitle 
                  icon={<FiTruck />}
                  text="Delivery"
                  count={filteredCounts.delivery}
                  active={activeTab === 'delivery'}
                />
              }
            >
              <OrderTable 
                orders={filteredOrders.delivery} 
                onStatusUpdate={updateOrderStatus}
                onViewDetails={viewOrderDetails}
                loading={loading}
                emptyMessage="No orders currently out for delivery"
              />
            </Tab>
            <Tab 
              eventKey="completed" 
              title={
                <TabTitle 
                  icon={<FiCheckCircle />}
                  text="Completed"
                  count={filteredCounts.completed}
                  active={activeTab === 'completed'}
                />
              }
            >
              <OrderTable 
                orders={filteredOrders.completed} 
                onStatusUpdate={updateOrderStatus}
                onViewDetails={viewOrderDetails}
                loading={loading}
                emptyMessage="No completed orders yet"
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

const TabTitle = ({ icon, text, count, active }) => (
  <span className="d-flex align-items-center justify-content-center">
    {icon && React.cloneElement(icon, { className: `me-2 ${active ? 'text-primary' : 'text-muted'}` })}
    <span className={active ? 'text-primary fw-bold' : 'text-muted'}>{text}</span>
    {count > 0 && (
      <Badge pill bg={active ? 'primary' : 'secondary'} className="ms-2">
        {count}
      </Badge>
    )}
  </span>
);

const OrderTable = ({ orders, onStatusUpdate, onViewDetails, loading, emptyMessage }) => {
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

  const StatusDropdown = ({ order }) => (
    <Dropdown>
      <Dropdown.Toggle 
        variant="outline-primary" 
        size="sm" 
        id="dropdown-status"
        className="d-flex align-items-center"
      >
        Update Status <FiChevronDown className="ms-1" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {order.status !== 'out-for-delivery' && (
          <Dropdown.Item 
            onClick={() => onStatusUpdate(order._id, 'out-for-delivery')}
          >
            Mark as Out for Delivery
          </Dropdown.Item>
        )}
        {order.status !== 'completed' && (
          <Dropdown.Item 
            onClick={() => onStatusUpdate(order._id, 'completed')}
          >
            Mark as Completed
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <div className="p-3">
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Loading orders...</div>
        </div>
      ) : (
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light">
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
                  <td colSpan="7" className="text-center py-5 text-muted">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <Button 
                        variant="link" 
                        onClick={() => onViewDetails(order)}
                        className="p-0 text-primary text-decoration-underline"
                      >
                        #{order._id.substring(0, 8)}...
                      </Button>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FiUser className="me-2 text-muted" />
                        {order.customerName}
                      </div>
                    </td>
                    <td>
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        {order.products.slice(0, 2).map(p => (
                          <span key={p.productId} className="text-truncate">
                            {p.name} (×{p.quantity})
                          </span>
                        ))}
                        {order.products.length > 2 && (
                          <small className="text-muted">
                            +{order.products.length - 2} more
                          </small>
                        )}
                      </div>
                    </td>
                    <td className="fw-bold">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td>
                      {getStatusBadge(order.status)}
                    </td>
                    <td>
                      <Stack direction="horizontal" gap={2} className="flex-wrap">
                        <StatusDropdown order={order} />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => onViewDetails(order)}
                        >
                          Details
                        </Button>
                      </Stack>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;