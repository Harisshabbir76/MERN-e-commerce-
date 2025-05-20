import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const NotFoundPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar removed - it should be in your layout component */}
      
      <Container 
        className="d-flex flex-column align-items-center justify-content-center text-center py-5"
        style={{ flex: 1 }}
      >
        <div 
          className="p-5 rounded"
          style={{
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
            border: '1px solid rgba(102,126,234,0.3)'
          }}
        >
          <h1 
            className="display-1 fw-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            404
          </h1>
          
          <h2 className="h4 mb-4" style={{ color: '#4a5568' }}>
            Oops! Page not found
          </h2>
          
          <p className="mb-4" style={{ color: '#718096', maxWidth: '500px' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Button
            as={Link}
            to="/"
            variant="primary"
            className="px-4 py-2"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '50px',
              fontWeight: '600'
            }}
          >
            Return Home
          </Button>
        </div>
      </Container>
      
     
    </div>
  );
};

export default NotFoundPage;