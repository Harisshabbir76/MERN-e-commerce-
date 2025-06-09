import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Spinner, 
  Alert, 
  Form, 
  Button, 
  Badge,
  Tab,
  Tabs,
  ListGroup
} from 'react-bootstrap';
import { 
  FaUser, 
  FaShoppingCart, 
  FaSearch, 
  FaEye, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaUserSecret,
  FaSync
} from 'react-icons/fa';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';

const UserAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [activeTab, setActiveTab] = useState('activity');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/analytics/users');
      // Ensure we always set an array, even if response.data is null/undefined
      setUsers(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivity = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      setError(null);
      const params = {
        [selectedUser.userId ? 'userId' : 'sessionId']: selectedUser.id,
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() })
      };
      
      const response = await axios.get('/api/analytics/user-activity', { params });
      setUserActivity(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching user activity:', err);
      setError(err.response?.data?.message || 'Failed to load user activity. Please try again.');
      setUserActivity([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUserActivity();
  }, [selectedUser, startDate, endDate]);

  const getEventIcon = (type) => {
    const icons = {
      page_view: <FaEye className="text-primary" />,
      add_to_cart: <FaShoppingCart className="text-success" />,
      purchase: <FaMoneyBillWave className="text-warning" />,
      search_query: <FaSearch className="text-info" />,
      search_result_click: <FaSearch className="text-secondary" />,
      product_view: <FaEye className="text-info" />,
      external_link_click: <FaEye className="text-danger" />,
      account_login: <FaUser className="text-success" />
    };
    return icons[type] || <FaCalendarAlt />;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const getUserSummary = () => {
    if (!Array.isArray(userActivity)) {
      return {
        pageViews: 0,
        addToCarts: 0,
        purchases: 0,
        searches: 0,
        productsViewed: 0,
        lastActivity: null
      };
    }

    return {
      pageViews: userActivity.filter(a => a?.eventType === 'page_view').length,
      addToCarts: userActivity.filter(a => a?.eventType === 'add_to_cart').length,
      purchases: userActivity.filter(a => a?.eventType === 'purchase').length,
      searches: userActivity.filter(a => a?.eventType === 'search_query').length,
      productsViewed: userActivity.filter(a => a?.eventType === 'product_view').length,
      lastActivity: userActivity[0]?.timestamp
    };
  };

  const filteredUsers = (users || []).filter(user => {
    if (!searchQuery || typeof searchQuery !== 'string') return true;
    
    const query = searchQuery.toLowerCase();
    const userFields = [
      user?.name,
      user?.email,
      user?.sessionId,
      user?.userAgent
    ].filter(Boolean).map(f => f.toLowerCase());

    return userFields.some(field => field.includes(query));
  });

  const handleRetry = () => {
    if (selectedUser) {
      fetchUserActivity();
    } else {
      fetchUsers();
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">
        <FaUser className="me-2" />
        User Activity Dashboard
      </h1>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <Form.Control 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Card.Header>
            <Card.Body className="p-0" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              {loading && !selectedUser ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading users...</p>
                </div>
              ) : error && !selectedUser ? (
                <div className="text-center py-5">
                  <Alert variant="danger">{error}</Alert>
                  <Button variant="primary" size="sm" onClick={handleRetry}>
                    <FaSync className="me-1" /> Retry
                  </Button>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <ListGroup.Item 
                        key={user.id}
                        action 
                        active={selectedUser?.id === user.id}
                        onClick={() => setSelectedUser(user)}
                        className="d-flex justify-content-between align-items-start py-3"
                      >
                        <div className="me-3">
                          <div className="d-flex align-items-center mb-1">
                            {user.isAnonymous ? (
                              <FaUserSecret className="me-2 text-muted" />
                            ) : (
                              <FaUser className="me-2" />
                            )}
                            <strong className="text-truncate" style={{ maxWidth: '150px' }}>
                              {user.name || user.email || `Session ${user.sessionId?.substring(0, 6) || 'N/A'}`}
                            </strong>
                          </div>
                          <small className="text-muted d-block text-truncate" style={{ maxWidth: '200px' }}>
                            {user.userAgent || 'Unknown device'}
                          </small>
                          <small className="text-muted">
                            {user.lastActivity ? formatDate(user.lastActivity) : 'No activity'}
                          </small>
                        </div>
                        <Badge bg={user.isAnonymous ? 'secondary' : 'primary'}>
                          {user.activityCount || 0}
                        </Badge>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-center py-4">
                      {searchQuery ? 'No matching users found' : 'No users available'}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {selectedUser ? (
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="mb-2">
                    <h5 className="mb-0 d-flex align-items-center">
                      {selectedUser.isAnonymous ? (
                        <FaUserSecret className="me-2 text-muted" />
                      ) : (
                        <FaUser className="me-2" />
                      )}
                      {selectedUser.name || selectedUser.email || 'Anonymous Session'}
                    </h5>
                    <small className="text-muted">
                      {selectedUser.userAgent || 'Unknown device'}
                    </small>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={setDateRange}
                      isClearable={true}
                      className="form-control"
                      placeholderText="Filter by date range"
                    />
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => {
                        setDateRange([null, null]);
                        setActiveTab('activity');
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body>
                <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                  <Tab eventKey="activity" title="Activity Log">
                    {loading ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading user activity...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-5">
                        <Alert variant="danger">{error}</Alert>
                        <Button variant="primary" size="sm" onClick={handleRetry}>
                          <FaSync className="me-1" /> Retry
                        </Button>
                      </div>
                    ) : userActivity.length === 0 ? (
                      <Alert variant="info">
                        No activity found for this {selectedUser.isAnonymous ? 'session' : 'user'}
                        {startDate || endDate ? ' in the selected date range' : ''}
                      </Alert>
                    ) : (
                      <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <Table striped bordered hover>
                          <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                            <tr>
                              <th>Time</th>
                              <th>Event</th>
                              <th>Details</th>
                              <th>Page</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userActivity.map((activity, index) => (
                              <tr key={index}>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                  {formatDate(activity.timestamp)}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {getEventIcon(activity.eventType)}
                                    <span className="ms-2 text-capitalize">
                                      {activity.eventType?.replace(/_/g, ' ') || 'Unknown event'}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  {activity.metadata ? (
                                    <pre className="mb-0" style={{
                                      whiteSpace: 'pre-wrap',
                                      fontSize: '0.8rem',
                                      maxHeight: '100px',
                                      overflowY: 'auto',
                                      margin: 0
                                    }}>
                                      {JSON.stringify(activity.metadata, null, 2)}
                                    </pre>
                                  ) : (
                                    <span className="text-muted">No details</span>
                                  )}
                                </td>
                                <td>
                                  {activity.pageUrl ? (
                                    <a 
                                      href={activity.pageUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-truncate d-block"
                                      style={{ maxWidth: '200px' }}
                                    >
                                      {activity.pageUrl}
                                    </a>
                                  ) : (
                                    <span className="text-muted">No URL</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Tab>
                  
                  <Tab eventKey="summary" title="Summary">
                    {selectedUser && (
                      <Row>
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Body>
                              <Card.Title>Activity Summary</Card.Title>
                              <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                  <span>Page Views</span>
                                  <Badge bg="primary">{getUserSummary().pageViews}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                  <span>Products Viewed</span>
                                  <Badge bg="info">{getUserSummary().productsViewed}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                  <span>Add to Cart</span>
                                  <Badge bg="success">{getUserSummary().addToCarts}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                  <span>Purchases</span>
                                  <Badge bg="warning">{getUserSummary().purchases}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                  <span>Searches</span>
                                  <Badge bg="secondary">{getUserSummary().searches}</Badge>
                                </ListGroup.Item>
                              </ListGroup>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card>
                            <Card.Body>
                              <Card.Title>Product Interactions</Card.Title>
                              {userActivity.filter(a => 
                                a?.eventType && ['add_to_cart', 'purchase', 'product_view'].includes(a.eventType)
                              ).length === 0 ? (
                                <Alert variant="info">No product interactions found</Alert>
                              ) : (
                                <ListGroup variant="flush">
                                  {userActivity
                                    .filter(a => 
                                      a?.eventType && ['add_to_cart', 'purchase', 'product_view'].includes(a.eventType)
                                    )
                                    .slice(0, 5)
                                    .map((activity, index) => (
                                      <ListGroup.Item key={index}>
                                        <div className="d-flex justify-content-between align-items-start">
                                          <div>
                                            <div className="fw-bold">
                                              {activity.metadata?.name || 'Unknown Product'}
                                            </div>
                                            <small className="text-muted">
                                              {formatDate(activity.timestamp)}
                                            </small>
                                          </div>
                                          <Badge 
                                            bg={
                                              activity.eventType === 'purchase' ? 'warning' :
                                              activity.eventType === 'add_to_cart' ? 'success' : 'info'
                                            }
                                          >
                                            {activity.eventType === 'purchase' ? 'Purchased' :
                                             activity.eventType === 'add_to_cart' ? 'Added to Cart' : 'Viewed'}
                                          </Badge>
                                        </div>
                                      </ListGroup.Item>
                                    ))}
                                </ListGroup>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    )}
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center py-5">
                <FaUser size={48} className="text-muted mb-3" />
                <h4>Select a user or session to view activity</h4>
                <p className="text-muted">
                  Click on an item from the list to see detailed activity
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserAnalytics;
