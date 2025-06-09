import { useState, useEffect } from 'react';
import { Button, Toast } from 'react-bootstrap';

export default function CookieBanner() {
  const [show, setShow] = useState(!localStorage.getItem('cookieConsent'));

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShow(false);
    window.dispatchEvent(new Event('cookieConsentUpdate'));
  };

  const handlePartialAccept = () => {
    localStorage.setItem('cookieConsent', 'partial');
    setShow(false);
    window.dispatchEvent(new Event('cookieConsentUpdate'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShow(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <Toast 
      show={show} 
      onClose={handleDecline}
      className="position-fixed bottom-0 end-0 m-3"
      bg="dark"
      style={{ maxWidth: '350px', zIndex: 9999 }}
    >
      <Toast.Header closeButton={false} className="bg-dark text-white">
        <strong className="me-auto">We Value Your Privacy</strong>
      </Toast.Header>
      <Toast.Body className="text-white">
        <p>We use cookies for essential functionality and analytics. You can choose which to accept.</p>
        <div className="d-flex flex-column gap-2">
          <Button variant="primary" size="sm" onClick={handleAccept}>
            Accept All
          </Button>
          <Button variant="outline-light" size="sm" onClick={handlePartialAccept}>
            Essential Only
          </Button>
          <Button variant="outline-light" size="sm" onClick={handleDecline}>
            Reject All
          </Button>
          <a href="/privacy" className="btn btn-link text-white text-decoration-underline">
            Learn More
          </a>
        </div>
      </Toast.Body>
    </Toast>
  );
}