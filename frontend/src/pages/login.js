import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Form, 
  Button, 
  Alert,
  Card,
  Stack
} from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('sublime-magic-production.up.railway.app/login', {
        email,
        password
      });
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h1 className="text-center mb-4" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          width: '100%'
        }}>
          Login
        </h1>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mb-3"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '10px',
              fontSize: '1.1rem'
            }}
          >
            Login
          </Button>

          <div className="text-center mt-3">
            <p className="text-muted">
              Don't have an account?{' '}
              <a 
                href="/signup" 
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
              >
                Register
              </a>
            </p>
          </div>
        </Form>
      </Card>
    </Container>
  );
}