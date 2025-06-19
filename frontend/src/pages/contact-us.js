import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaPaperPlane, FaUser, FaEnvelope, FaTag, FaComment, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Popup from '../components/popup';
import '../App.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [popupConfig, setPopupConfig] = useState({
    show: false,
    title: "",
    content: null,
    headerClass: "",
    footerContent: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showSuccessPopup = (message) => {
    setPopupConfig({
      show: true,
      title: "Success!",
      headerClass: "bg-success text-white",
      content: (
        <div className="popup-content text-center">
          <FaCheckCircle className="text-success mb-3" size={48} />
          <h5 className="mb-2">Message Sent Successfully!</h5>
          <p className="mb-3">{message}</p>
          <p className="small text-muted">
            We'll respond to your inquiry within 24 hours.
          </p>
        </div>
      ),
      footerContent: (
        <Button 
          variant="success" 
          onClick={hidePopup}
          className="px-4"
        >
          OK
        </Button>
      )
    });
  };

  const showErrorPopup = (message) => {
    setPopupConfig({
      show: true,
      title: "Error",
      headerClass: "bg-danger text-white",
      content: (
        <div className="popup-content text-center">
          <FaTimesCircle className="text-danger mb-3" size={48} />
          <h5 className="mb-2">Sending Failed</h5>
          <Alert variant="light" className="mb-3">
            {message}
          </Alert>
          <p>Please check your information and try again.</p>
        </div>
      ),
      footerContent: (
        <div className="d-flex gap-2 justify-content-center w-100">
          <Button 
            variant="outline-secondary" 
            onClick={hidePopup}
            className="px-3"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleSubmit}
            className="px-3"
          >
            Try Again
          </Button>
        </div>
      )
    });
  };

  const hidePopup = () => {
    setPopupConfig(prev => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("https://mern-e-commerce-yjbp.vercel.app/contactUs", formData);
      showSuccessPopup(response.data.message || "Thank you for your message!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      showErrorPopup(
        error.response?.data?.error || 
        "An unexpected error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="contact-page py-5">
      <div className="page-header-wrapper mb-5 text-center">
        <h1 className="page-header">Contact Us</h1>
        
        <p className="lead mt-3">We'd love to hear from you!</p>
      </div>
      
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Form onSubmit={handleSubmit} className="contact-form p-4 p-md-5 shadow-sm rounded-3 bg-white">
            <Form.Group controlId="name" className="mb-4 form-group">
              <div className="input-icon">
                <FaUser className="text-muted" />
              </div>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=" "
                className="form-input py-3 ps-5"
              />
              <label>Your Name</label>
            </Form.Group>

            <Form.Group controlId="email" className="mb-4 form-group">
              <div className="input-icon">
                <FaEnvelope className="text-muted" />
              </div>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your Email"
                className="form-input py-3 ps-5"
              />
            </Form.Group>

            <Form.Group controlId="subject" className="mb-4 form-group">
              <div className="input-icon">
                <FaTag className="text-muted" />
              </div>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Subject"
                className="form-input py-3 ps-5"
              />
            </Form.Group>

            <Form.Group controlId="message" className="mb-4 form-group">
              <div className="input-icon align-items-start pt-3">
                <FaComment className="text-muted" />
              </div>
              <Form.Control
                as="textarea"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your Message"
                className="form-input py-3 ps-5"
              />
            </Form.Group>

            <div className="text-center mt-4">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting}
                className="submit-btn py-3 px-5 rounded-pill fw-bold"
                style={{ minWidth: '200px' }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="me-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <Popup
        show={popupConfig.show}
        onHide={hidePopup}
        title={popupConfig.title}
        headerClass={popupConfig.headerClass}
        footerContent={popupConfig.footerContent}
        bodyClass="py-4 px-3"
        centered
      >
        {popupConfig.content}
      </Popup>
    </Container>
  );
};

export default ContactUs;