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
  FaCalendarAlt 
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://sublime-magic-production.up.railway.app/api/analytics/users');
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchUserActivity = async () => {
        try {
          setLoading(true);
          const params = {
            userId: selectedUser._id,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
          };
          const response = await axios.get('https://sublime-magic-production.up.railway.app/api/analytics/user-activity', { params });
          setUserActivity(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load user activity');
        } finally {
          setLoading(false);
        }
      };

      fetchUserActivity();
    }
  }, [selectedUser, startDate, endDate]);

  const getEventIcon = (type) => {
    const icons = {
      page_view: <FaEye className="text-primary" />,
      add_to_cart: <FaShoppingCart className="text-success" />,
      purchase: <FaMoneyBillWave className="text-warning" />,
      search_query: <FaSearch className="text-info" />,
      search_result_click: <FaSearch className="text-secondary" />
    };
    return icons[type] || <FaCalendarAlt />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getUserSummary = (userId) => {
    const userActivities = userActivity.filter(act => act.userId === userId);
    const summary = {
      pageViews: userActivities.filter(a => a.eventType === 'page_view').length,
      addToCarts: userActivities.filter(a => a.eventType === 'add_to_cart').length,
      purchases: userActivities.filter(a => a.eventType === 'purchase').length,
      searches: userActivities.filter(a => a.eventType === 'search_query').length,
      lastActivity: userActivities[0]?.timestamp
    };
    return summary;
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">
        <FaUser className="me-2" />
        User Activity Dashboard
      </h1>

      <Row>
        {/* User List */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <span>Users</span>
                <Form.Group className="mb-0">
                  <Form.Control 
                    type="text" 
                    placeholder="Search users..." 
                    onChange={(e) => {
                      // Implement search functionality if needed
                    }}
                  />
                </Form.Group>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <ListGroup variant="flush">
                  {users.map(user => (
                    <ListGroup.Item 
                      key={user._id}
                      action 
                      active={selectedUser?._id === user._id}
                      onClick={() => setSelectedUser(user)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{user.name || `User ${user._id.substring(0, 6)}`}</strong>
                        <div className="text-muted small">{user.email}</div>
                      </div>
                      <Badge bg="light" text="dark">
                        {new Date(user.lastActivity).toLocaleDateString()}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* User Details */}
        <Col md={8}>
          {selectedUser ? (
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">
                      {selectedUser.name || `User ${selectedUser._id.substring(0, 6)}`}
                    </h5>
                    <small className="text-muted">{selectedUser.email}</small>
                  </div>
                  <div className="d-flex">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => setDateRange(update)}
                      isClearable={true}
                      className="form-control me-2"
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
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-3"
                >
                  <Tab eventKey="activity" title="Activity Log">
                    {loading ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading user activity...</p>
                      </div>
                    ) : error ? (
                      <Alert variant="danger">{error}</Alert>
                    ) : (
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
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
                                <td>{formatDate(activity.timestamp)}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {getEventIcon(activity.eventType)}
                                    <span className="ms-2 text-capitalize">
                                      {activity.eventType.replace(/_/g, ' ')}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <pre className="mb-0" style={{
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.8rem',
                                    maxHeight: '100px',
                                    overflowY: 'auto'
                                  }}>
                                    {JSON.stringify(activity.metadata, null, 2)}
                                  </pre>
                                </td>
                                <td>
                                  <Link to={activity.pageUrl} target="_blank">
                                    {activity.pageUrl}
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Tab>
                  
                  <Tab eventKey="summary" title="User Summary">
                    {selectedUser && (
                      <Row>
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Body>
                              <Card.Title>Activity Summary</Card.Title>
                              <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                  <span>Page Views</span>
                                  <Badge bg="primary">{getUserSummary(selectedUser._id).pageViews}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                  <span>Add to Cart</span>
                                  <Badge bg="success">{getUserSummary(selectedUser._id).addToCarts}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                  <span>Purchases</span>
                                  <Badge bg="warning">{getUserSummary(selectedUser._id).purchases}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                  <span>Searches</span>
                                  <Badge bg="info">{getUserSummary(selectedUser._id).searches}</Badge>
                                </ListGroup.Item>
                              </ListGroup>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card>
                            <Card.Body>
                              <Card.Title>Recent Products</Card.Title>
                              <ListGroup variant="flush">
                                {userActivity
                                  .filter(a => a.eventType === 'add_to_cart' || a.eventType === 'purchase')
                                  .slice(0, 5)
                                  .map((activity, index) => (
                                    <ListGroup.Item key={index}>
                                      <div className="d-flex justify-content-between">
                                        <span>
                                          {activity.metadata?.name || 'Unknown Product'}
                                        </span>
                                        <Badge bg={activity.eventType === 'purchase' ? 'warning' : 'success'}>
                                          {activity.eventType === 'purchase' ? 'Purchased' : 'Added to Cart'}
                                        </Badge>
                                      </div>
                                      <small className="text-muted">
                                        {formatDate(activity.timestamp)}
                                      </small>
                                    </ListGroup.Item>
                                  ))}
                              </ListGroup>
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
                <h4>Select a user to view activity</h4>
                <p className="text-muted">
                  Click on a user from the list to see their detailed activity
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