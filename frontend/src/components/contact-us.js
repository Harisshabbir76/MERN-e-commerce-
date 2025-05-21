import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { FiUser, FiMail, FiMessageSquare, FiSend, FiCheck } from 'react-icons/fi';
import ReplyModal from './ReplyModal';

export default function ContactUs() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/contactus/show');
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
      await axios.post('http://localhost:5000/contactus/reply', {
        ...emailData,
        messageId: currentMessage._id // Include message ID for tracking
      });

      // Update local state to mark as replied
      setMessages(messages.map(msg => 
        msg._id === currentMessage._id ? { ...msg, replied: true } : msg
      ));

      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to send reply');
    }
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

  if (!messages.length) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-dark">No contact messages found</h2>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4" style={{ color: '#d9230f' }}>
        Contact Messages
        <Badge bg="secondary" className="ms-2">
          {messages.length}
        </Badge>
      </h2>
      
      <div className="row g-3">
        {messages.map((message) => (
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

      <ReplyModal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        message={currentMessage}
        onSend={handleSendReply}
      />
    </Container>
  );
}