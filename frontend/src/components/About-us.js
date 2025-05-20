import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Badge,
  ListGroup,
  Accordion
} from 'react-bootstrap';
import { 
  FaUsers, 
  FaBullseye, 
  FaHandshake, 
  FaAward,
  FaCheckCircle,
  FaQuoteLeft
} from 'react-icons/fa';

// Import team member images
import member1 from '../images/member1.jpeg';
import member2 from '../images/member2.jpeg';
import member3 from '../images/member3.jpeg';
import member4 from '../images/member4.jpeg';

const AboutUs = () => {
  const teamMembers = [
    { name: 'John Doe', role: 'CEO', image: member1 },
    { name: 'Jane Smith', role: 'Design Director', image: member2 },
    { name: 'Mike Johnson', role: 'Tech Lead', image: member3 },
    { name: 'Sarah Williams', role: 'Marketing Head', image: member4 }
  ];

  const milestones = [
    { year: '2010', event: 'Company Founded' },
    { year: '2014', event: 'First Major Client' },
    { year: '2018', event: 'Expanded to 3 Countries' },
    { year: '2022', event: 'Reached 1M Customers' }
  ];

  return (
    <Container className="my-5">
      {/* Hero Section */}
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="display-4 mb-4">About Our Company</h1>
          <p className="lead text-muted">
            We've been delivering excellence for over a decade, serving customers worldwide with passion and dedication.
          </p>
        </Col>
      </Row>

      {/* Mission and Values */}
      <Row className="mb-5">
        <Col md={6} className="mb-4 mb-md-0">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <FaBullseye className="text-primary mb-3" size={32} />
              <Card.Title as="h3">Our Mission</Card.Title>
              <Card.Text>
                To provide innovative solutions that transform businesses and create lasting value for our customers, 
                employees, and communities through technology and exceptional service.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <FaHandshake className="text-primary mb-3" size={32} />
              <Card.Title as="h3">Our Values</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0">
                  <FaCheckCircle className="text-success me-2" /> Integrity in all we do
                </ListGroup.Item>
                <ListGroup.Item className="border-0">
                  <FaCheckCircle className="text-success me-2" /> Customer-first approach
                </ListGroup.Item>
                <ListGroup.Item className="border-0">
                  <FaCheckCircle className="text-success me-2" /> Continuous innovation
                </ListGroup.Item>
                <ListGroup.Item className="border-0">
                  <FaCheckCircle className="text-success me-2" /> Team collaboration
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Team Section */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">
            <FaUsers className="me-2" /> Meet Our Team
          </h2>
          <Row>
            {teamMembers.map((member, index) => (
              <Col key={index} xs={6} md={3} className="mb-4">
                <Card className="h-100 border-0 text-center">
                  <div className="d-flex justify-content-center mt-3">
                    <Image 
                      src={member.image} 
                      roundedCircle 
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        objectFit: 'cover',
                        border: '3px solid #3498db'
                      }} 
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>{member.name}</Card.Title>
                    <Badge bg="primary" pill>{member.role}</Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* History/Accordion */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">
            <FaAward className="me-2" /> Our Journey
          </h2>
          <Accordion defaultActiveKey="0" flush>
            {milestones.map((item, index) => (
              <Accordion.Item key={index} eventKey={index.toString()}>
                <Accordion.Header>
                  <strong className="me-2">{item.year}:</strong> {item.event}
                </Accordion.Header>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      {/* Testimonial */}
      <Row className="mb-5">
        <Col>
          <Card className="border-0 bg-light">
            <Card.Body className="p-5 text-center">
              <FaQuoteLeft className="text-muted mb-3" size={24} />
              <blockquote className="blockquote mb-0">
                <p className="fs-4">
                  "Working with this company has been transformative for our business. Their 
                  innovative approach and dedicated team delivered results beyond our expectations."
                </p>
                <footer className="blockquote-footer mt-3">
                  Satisfied Customer from <cite>Global Enterprises</cite>
                </footer>
              </blockquote>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CTA */}
      <Row className="text-center">
        <Col>
          <Card className="border-0 bg-primary text-white">
            <Card.Body className="p-4">
              <h3>Ready to work with us?</h3>
              <p className="mb-4 text-white">Join thousands of satisfied customers worldwide</p>
              <Button 
                as={Link} 
                to="/contact-us" 
                variant="light" 
                size="lg" 
                className="px-4"
              >
                Contact Us Today
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;