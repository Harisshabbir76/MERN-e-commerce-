// components/ReplyModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FiSend, FiCheck } from 'react-icons/fi';

const ReplyModal = ({ show, onHide, message, onSend }) => {
  const [replyData, setReplyData] = useState({
    subject: `Re: ${message?.subject || 'Your message'}`,
    content: ''
  });
  const [sending, setSending] = useState(false);
  const [isSent, setIsSent] = useState(false); // New state for success

  const handleSend = async () => {
    if (!replyData.subject || !replyData.content) {
      return;
    }

    setSending(true);
    try {
      await onSend({
        to: message.email,
        subject: replyData.subject,
        text: replyData.content
      });
      setIsSent(true); // Mark as sent successfully
    } catch (error) {
      alert(error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isSent ? (
            <span className="text-success">
              <FiCheck className="me-2" /> Reply Sent
            </span>
          ) : (
            `Reply to ${message?.name}`
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isSent ? (
          <Alert variant="success" className="mb-0">
            Your reply has been sent to <strong>{message?.email}</strong>.
          </Alert>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={replyData.subject}
                onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={replyData.content}
                onChange={(e) => setReplyData({...replyData, content: e.target.value})}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {isSent ? 'Close' : 'Cancel'}
        </Button>
        
        {!isSent && (
          <Button 
            variant="danger" 
            onClick={handleSend}
            disabled={sending || !replyData.content}
          >
            {sending ? (
              <>
                <Spinner as="span" size="sm" animation="border" />
                <span className="ms-2">Sending...</span>
              </>
            ) : (
              <>
                <FiSend className="me-1" /> Send Reply
              </>
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ReplyModal;