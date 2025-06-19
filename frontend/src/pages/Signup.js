import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Form, 
  Button, 
  Alert,
  Card,
  Stack
} from 'react-bootstrap';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('https://mern-e-commerce-yjbp.vercel.app/signup', {
        name,
        email,
        password,
        age,
        username
      });
      if (res.data.success) {
        alert("Signup Successful");
        navigate('/login');
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
          Create Account
        </h1>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

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

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="13"
              max="120"
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
            Sign Up
          </Button>

          <div className="text-center mt-3">
            <p className="text-muted">
              Already have an account?{' '}
              <a 
                href="/login" 
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                Login
              </a>
            </p>
          </div>
        </Form>
      </Card>
    </Container>
  );
}