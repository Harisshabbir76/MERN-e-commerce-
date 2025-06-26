import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Card, 
  Spinner, 
  Alert, 
  Button, 
  Badge,
  Tabs,
  Tab,
  Stack,
  Row,
  Col
} from 'react-bootstrap';
import { FiUser, FiMail, FiMessageSquare, FiSend, FiCheck, FiInbox } from 'react-icons/fi';
import ReplyModal from './ReplyModal';
import './heroSlider.css'

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('unreplied');
  const [counts, setCounts] = useState({
    all: 0,
    unreplied: 0,
    replied: 0
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('https://mern-e-commerce-production-10a6.up.railway.app/contactus/show', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMessages(res.data);
        
        // Calculate counts
        const unrepliedCount = res.data.filter(msg => !msg.replied).length;
        const repliedCount = res.data.filter(msg => msg.replied).length;
        
        setCounts({
          all: res.data.length,
          unreplied: unrepliedCount,
          replied: repliedCount
        });
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleSendReply = async (emailData) => {
    try {
      // Send the reply email
      await axios.post('https://mern-e-commerce-production-10a6.up.railway.app/contactus/reply', {
        ...emailData,
        messageId: currentMessage._id
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state to mark as replied
      const updatedMessages = messages.map(msg => 
        msg._id === currentMessage._id ? { ...msg, replied: true } : msg
      );
      
      setMessages(updatedMessages);
      setCounts({
        all: updatedMessages.length,
        unreplied: updatedMessages.filter(msg => !msg.replied).length,
        replied: updatedMessages.filter(msg => msg.replied).length
      });

      setShowReplyModal(false);
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to send reply');
    }
  };

  const filteredMessages = {
    all: messages,
    unreplied: messages.filter(message => !message.replied),
    replied: messages.filter(message => message.replied)
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading messages...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h5>Error loading messages</h5>
          <p className="mb-0">{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="contact-messages-container py-4">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-primary text-white py-3">
          <Stack direction="horizontal" gap={2} className="justify-content-between align-items-center">
            <h3 className="mb-0">
              <FiInbox className="me-2" />
              Contact Messages
            </h3>
            <Badge pill bg="light" text="dark" className="fs-6">
              Total: {messages.length}
            </Badge>
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
                  text="All Messages"
                  count={counts.all}
                  active={activeTab === 'all'}
                />
              }
            >
              <MessagesGrid 
                messages={filteredMessages.all} 
                onReply={(msg) => {
                  setCurrentMessage(msg);
                  setShowReplyModal(true);
                }}
                emptyMessage="No messages found"
              />
            </Tab>
            <Tab 
              eventKey="unreplied" 
              title={
                <TabTitle 
                  text="Unreplied"
                  count={counts.unreplied}
                  active={activeTab === 'unreplied'}
                  variant="danger"
                />
              }
            >
              <MessagesGrid 
                messages={filteredMessages.unreplied} 
                onReply={(msg) => {
                  setCurrentMessage(msg);
                  setShowReplyModal(true);
                }}
                emptyMessage="No unreplied messages"
              />
            </Tab>
            <Tab 
              eventKey="replied" 
              title={
                <TabTitle 
                  text="Replied"
                  count={counts.replied}
                  active={activeTab === 'replied'}
                  variant="success"
                />
              }
            >
              <MessagesGrid 
                messages={filteredMessages.replied} 
                emptyMessage="No replied messages yet"
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <ReplyModal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        message={currentMessage}
        onSend={handleSendReply}
      />
    </Container>
  );
};

const TabTitle = ({ text, count, active, variant = 'secondary' }) => (
  <span className="d-flex align-items-center justify-content-center">
    <span className={active ? 'text-primary fw-bold' : 'text-muted'}>{text}</span>
    {count > 0 && (
      <Badge pill bg={active ? 'primary' : variant} className="ms-2">
        {count}
      </Badge>
    )}
  </span>
);

const MessagesGrid = ({ messages, onReply, emptyMessage }) => {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-3">
      {messages.length === 0 ? (
        <Alert variant="light" className="text-center py-4">
          <FiInbox size={24} className="mb-2 text-muted" />
          <p className="mb-0 text-muted">{emptyMessage}</p>
        </Alert>
      ) : (
        <Row className="g-3">
          {messages.map((message) => (
            <Col key={message._id} xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                  <div className="d-flex align-items-center">
                    <FiUser className="me-2 text-primary" />
                    <strong>{message.name}</strong>
                  </div>
                  {message.replied ? (
                    <Badge bg="success" className="d-flex align-items-center">
                      <FiCheck className="me-1" /> Replied
                    </Badge>
                  ) : (
                    <Badge bg="danger">Unreplied</Badge>
                  )}
                </Card.Header>
                <Card.Body>
                  <Stack gap={3}>
                    <div className="d-flex align-items-start">
                      <FiMail className="me-2 mt-1 text-muted" />
                      <div>
                        <small className="text-muted">Email</small>
                        <div className="text-truncate">{message.email}</div>
                      </div>
                    </div>
                    
                    <div>
                      <small className="text-muted">Subject</small>
                      <div className="fw-semibold">{message.subject}</div>
                    </div>
                    
                    <div className="d-flex align-items-start">
                      <FiMessageSquare className="me-2 mt-1 text-muted" />
                      <div>
                        <small className="text-muted">Message</small>
                        <p className="mb-0">{message.message}</p>
                      </div>
                    </div>
                  </Stack>
                </Card.Body>
                <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {formatDate(message.createdAt)}
                  </small>
                  {!message.replied && onReply && (
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onReply(message)}
                      className="d-flex align-items-center"
                    >
                      <FiSend className="me-1" /> Reply
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};