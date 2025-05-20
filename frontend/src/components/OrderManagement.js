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
  Dropdown
} from 'react-bootstrap';
import { 
  FiRefreshCw, 
  FiTruck, 
  FiCheckCircle, 
  FiUser, 
  FiShoppingBag,
  FiDownload,
  FiFileText
} from 'react-icons/fi';
import * as XLSX from 'xlsx';

const ExportOrders = ({ orders }) => {
  const exportToExcel = (ordersToExport, fileName) => {
    const data = ordersToExport.map(order => ({
      'Order ID': order._id,
      'Customer Name': order.customerName,
      'Email': order.email,
      'Phone': order.phone,
      'Address': `${order.address}, ${order.city}, ${order.zipCode}`,
      'Order Date': new Date(order.orderDate).toLocaleString(),
      'Products': order.products.map(p => `${p.name} (x${p.quantity})`).join(', '),
      'Total Amount': `$${order.totalAmount.toFixed(2)}`,
      'Status': order.status,
      'Payment Method': order.paymentMethod
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleExportClick = (type) => {
    switch(type) {
      case 'all':
        exportToExcel(orders, 'all_orders');
        break;
      case 'delivery':
        const deliveryOrders = orders.filter(order => order.status === 'out-for-delivery');
        exportToExcel(deliveryOrders, 'delivery_orders');
        break;
      case 'completed':
        const completedOrders = orders.filter(order => order.status === 'completed');
        exportToExcel(completedOrders, 'completed_orders');
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle 
        variant="light" 
        className="d-flex align-items-center justify-content-center"
        style={{ 
          background: 'rgba(255,255,255,0.9)',
          color: '#667eea',
          fontWeight: 500,
          borderRadius: '8px',
          padding: '8px 16px',
          border: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          minWidth: '110px',
          height: '38px'
        }}
      >
        <FiDownload className="me-2" /> Export
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ 
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <Dropdown.Item 
          onClick={() => handleExportClick('all')}
          style={{ padding: '8px 16px' }}
        >
          <FiFileText className="me-2" /> All Orders
        </Dropdown.Item>
        <Dropdown.Item 
          onClick={() => handleExportClick('delivery')}
          style={{ padding: '8px 16px' }}
        >
          <FiTruck className="me-2" /> Out for Delivery
        </Dropdown.Item>
        <Dropdown.Item 
          onClick={() => handleExportClick('completed')}
          style={{ padding: '8px 16px' }}
        >
          <FiCheckCircle className="me-2" /> Completed
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

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
          navigate('/404');
          return;
        }

        const response = await axios.get('http://localhost:5000/auth/me', {
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
      const response = await axios.get('http://localhost:5000/allOrder');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/allOrder/${orderId}/status`, {
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
        <Spinner animation="border" variant="light" />
        <div className="mt-3 text-white">Checking authorization...</div>
      </Container>
    );
  }

  if (!isAuthorized) {
    return null; // Redirect will happen in useEffect
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="light" />
        <div className="mt-3 text-white">Loading orders...</div>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <Card 
        className="border-0 shadow" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(102,126,234,0.95) 0%, rgba(118,75,162,0.95) 100%)',
          borderRadius: '15px',
          overflow: 'hidden'
        }}
      >
        <Card.Body className="p-0">
          <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0 text-white">Order Management</h2>
              <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                <ExportOrders orders={orders} />
                <Button 
                  variant="light" 
                  onClick={fetchOrders}
                  className="d-flex align-items-center justify-content-center"
                  style={{ 
                    background: 'rgba(255,255,255,0.9)',
                    color: '#667eea',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    minWidth: '110px',
                    height: '38px'
                  }}
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
            style={{ borderBottom: 'none' }}
          >
            <Tab 
              eventKey="all" 
              title={
                <span className="d-flex align-items-center" style={{ 
                  color: activeTab === 'all' ? 'black' : 'rgba(255,255,255,0.7)',
                  fontWeight: activeTab === 'all' ? 600 : 400,
                  padding: '0.5rem 0'
                }}>
                  All Orders
                  {filteredOrders.all.length > 0 && (
                    <Badge pill bg="light" text="dark" className="ms-2">
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
              />
            </Tab>
            <Tab 
              eventKey="delivery" 
              title={
                <span className="d-flex align-items-center" style={{ 
                  color: activeTab === 'delivery' ? 'black' : 'rgba(255,255,255,0.7)',
                  fontWeight: activeTab === 'delivery' ? 600 : 400,
                  padding: '0.5rem 0'
                }}>
                  <FiTruck className="me-1" /> Delivery
                  {filteredOrders.delivery.length > 0 && (
                    <Badge pill bg="light" text="dark" className="ms-2">
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
              />
            </Tab>
            <Tab 
              eventKey="completed" 
              title={
                <span className="d-flex align-items-center" style={{ 
                  color: activeTab === 'completed' ? 'black' : 'rgba(255,255,255,0.7)',
                  fontWeight: activeTab === 'completed' ? 600 : 400,
                  padding: '0.5rem 0'
                }}>
                  <FiCheckCircle className="me-1" /> Completed
                  {filteredOrders.completed.length > 0 && (
                    <Badge pill bg="light" text="dark" className="ms-2">
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
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <div className="mb-4">
                <h5><FiUser className="me-2" />Customer Information</h5>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.email}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                  </div>
                </div>
                <p><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.zipCode}</p>
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
                    {selectedOrder.products.map((product, index) => (
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
                <h5><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</h5>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <Badge bg={selectedOrder.status === 'completed' ? 'success' : 
                          selectedOrder.status === 'out-for-delivery' ? 'primary' : 'warning'}>
                  {selectedOrder.status}
                </Badge>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const OrderTable = ({ orders, onStatusUpdate, onViewDetails, showAll }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" text="dark" style={{ fontWeight: 500 }}>Pending</Badge>;
      case 'out-for-delivery':
        return <Badge bg="primary" style={{ fontWeight: 500 }}>Out for Delivery</Badge>;
      case 'completed':
        return <Badge bg="success" style={{ fontWeight: 500 }}>Completed</Badge>;
      default:
        return <Badge bg="secondary" style={{ fontWeight: 500 }}>{status}</Badge>;
    }
  };

  return (
    <div className="p-4">
      <Table 
        striped 
        bordered 
        hover 
        responsive 
        className="mb-0"
        style={{ 
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        <thead style={{ background: 'rgba(102,126,234,0.1)' }}>
          <tr>
            <th style={{ color: '#4f46e5', fontWeight: 600 }}>Order ID</th>
            <th style={{ color: '#4f46e5', fontWeight: 600 }}>Customer</th>
            <th style={{ color: '#4f46e5', fontWeight: 600 }}>Date</th>
            <th style={{ color: '#4f46e5', fontWeight: 600 }}>Products</th>
            <th style={{ color: '#4f46e5', fontWeight: 600 }}>Total</th>
            <th style={{ color: '#4f46e5', fontWeight: 600 }}>Status</th>
            <th style={{ color: '#4f46e5', fontWeight: 600 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4" style={{ color: '#6b7280' }}>
                No orders found
              </td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order._id}>
                <td style={{ color: '#1f2937', fontWeight: 500 }}>
                  <Button 
                    variant="link" 
                    onClick={() => onViewDetails(order)}
                    style={{ 
                      color: '#4f46e5',
                      fontWeight: 500,
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    {order._id.substring(0, 8)}...
                  </Button>
                </td>
                <td style={{ color: '#1f2937', fontWeight: 500 }}>
                  {order.customerName}
                </td>
                <td style={{ color: '#6b7280' }}>
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td>
                  {order.products.slice(0, 2).map(p => (
                    <div 
                      key={p.productId} 
                      style={{ color: '#1f2937', fontSize: '0.875rem' }}
                    >
                      {p.name} (x{p.quantity})
                    </div>
                  ))}
                  {order.products.length > 2 && (
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                      +{order.products.length - 2} more items
                    </div>
                  )}
                </td>
                <td style={{ color: '#1f2937', fontWeight: 600 }}>
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td>
                  {getStatusBadge(order.status)}
                </td>
                <td>
                  {order.status === 'pending' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => onStatusUpdate(order._id, 'out-for-delivery')}
                      style={{ 
                        fontWeight: 500,
                        borderRadius: '6px',
                        padding: '0.25rem 0.75rem',
                        marginBottom: '0.25rem'
                      }}
                    >
                      Mark as Out for Delivery
                    </Button>
                  )}
                  {order.status === 'out-for-delivery' && (
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => onStatusUpdate(order._id, 'completed')}
                      style={{ 
                        fontWeight: 500,
                        borderRadius: '6px',
                        padding: '0.25rem 0.75rem',
                        marginBottom: '0.25rem'
                      }}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onViewDetails(order)}
                    style={{ 
                      fontWeight: 500,
                      borderRadius: '6px',
                      padding: '0.25rem 0.75rem'
                    }}
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