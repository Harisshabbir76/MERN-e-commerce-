import { useEffect, useState } from 'react';
import { Button, Toast } from 'react-bootstrap';

export default function CookieBanner() {
  const [show, setShow] = useState(!localStorage.getItem('cookieConsent'));

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShow(false);
    window.dispatchEvent(new Event('cookieConsentUpdate'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShow(false);
  };

  if (!show) return null;

  return (
    <Toast 
      show={show} 
      onClose={handleDecline}
      className="position-fixed bottom-0 end-0 m-3"
      bg="dark"
      autohide
      delay={10000}
    >
      <Toast.Header closeButton={false}>
        <strong className="me-auto">We Value Your Privacy</strong>
      </Toast.Header>
      <Toast.Body className="text-white">
        <p>We use cookies to enhance your experience. By continuing, you agree to our use of cookies.</p>
        <div className="d-flex gap-2">
          <Button variant="outline-light" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button variant="light" size="sm" onClick={handleAccept}>
            Accept
          </Button>
          <a href="/privacy" className="btn btn-link text-white">
            Learn More
          </a>
        </div>
      </Toast.Body>
    </Toast>
  );
}