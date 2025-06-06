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
  Tab
} from 'react-bootstrap';
import { FiUser, FiMail, FiMessageSquare, FiSend, FiCheck } from 'react-icons/fi';
import ReplyModal from './ReplyModal';

export default function ContactUs() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('unreplied');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('https://sublime-magic-production.up.railway.app/contactus/show', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMessages(res.data);
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
      await axios.post('https://sublime-magic-production.up.railway.app/contactus/reply', {
        ...emailData,
        messageId: currentMessage._id
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state to mark as replied
      setMessages(messages.map(msg => 
        msg._id === currentMessage._id ? { ...msg, replied: true } : msg
      ));

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
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
        <div className="mt-3 text-dark">Loading messages...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Error loading messages: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4" style={{ color: '#d9230f' }}>
        Contact Messages
      </h2>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab 
          eventKey="all" 
          title={
            <span className="d-flex align-items-center">
              All Messages
              <Badge bg="secondary" className="ms-2">
                {filteredMessages.all.length}
              </Badge>
            </span>
          }
        >
          {/* Content will be rendered below */}
        </Tab>
        <Tab 
          eventKey="unreplied" 
          title={
            <span className="d-flex align-items-center">
              Unreplied
              <Badge bg="danger" className="ms-2">
                {filteredMessages.unreplied.length}
              </Badge>
            </span>
          }
        >
          {/* Content will be rendered below */}
        </Tab>
        <Tab 
          eventKey="replied" 
          title={
            <span className="d-flex align-items-center">
              Replied
              <Badge bg="success" className="ms-2">
                {filteredMessages.replied.length}
              </Badge>
            </span>
          }
        >
          {/* Content will be rendered below */}
        </Tab>
      </Tabs>

      {filteredMessages[activeTab].length === 0 ? (
        <Alert variant="info" className="text-center">
          No {activeTab} messages found
        </Alert>
      ) : (
        <div className="row g-3">
          {filteredMessages[activeTab].map((message) => (
            <div key={message._id} className="col-md-6 col-lg-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Header 
                  className="text-white d-flex align-items-center" 
                  style={{ backgroundColor: '#d9230f' }}
                >
                  <FiUser className="me-2" />
                  <strong>{message.name}</strong>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <FiMail className="me-2 text-danger" />
                    <span>{message.email}</span>
                  </div>
                  <div className="mb-2">
                    <strong>Subject:</strong> {message.subject}
                  </div>
                  <div className="d-flex">
                    <FiMessageSquare className="me-2 text-danger mt-1" />
                    <p className="mb-0">{message.message}</p>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-light d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {new Date(message.createdAt).toLocaleString()}
                  </small>
                  {message.replied ? (
                    <Badge bg="success" className="d-flex align-items-center">
                      <FiCheck className="me-1" /> Replied
                    </Badge>
                  ) : (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => {
                        setCurrentMessage(message);
                        setShowReplyModal(true);
                      }}
                    >
                      <FiSend className="me-1" /> Reply
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      )}

      <ReplyModal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        message={currentMessage}
        onSend={handleSendReply}
      />
    </Container>
  );
}