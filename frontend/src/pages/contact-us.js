import React, { useState } from "react";
import axios from "axios";
import { 
  Container, 
  Form, 
  Button,
  Alert
} from 'react-bootstrap';
import { 
  FaPaperPlane, 
  FaUser, 
  FaEnvelope,
  FaTag, 
  FaComment,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import Popup from '../components/popup'
import '../components/heroSlider.css';

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
        <div className="popup-content">
          <div className="d-flex align-items-center mb-3">
            <FaCheckCircle className="text-success me-2" size={24} />
            <h5 className="mb-0">Message Sent!</h5>
          </div>
          <p>{message}</p>
          <p className="small text-muted mt-2">
            We'll respond to your inquiry within 24 hours.
          </p>
          <div className="popup-decoration"></div>
        </div>
      ),
      footerContent: (
        <Button 
          variant="success" 
          onClick={hidePopup}
          className="px-4"
        >
          OK!
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
        <div className="popup-content">
          <div className="d-flex align-items-center mb-3">
            <FaTimesCircle className="text-danger me-2" size={24} />
            <h5 className="mb-0">Sending Failed</h5>
          </div>
          <Alert variant="light" className="mb-3">
            {message}
          </Alert>
          <p>Please check your information and try again.</p>
          <div className="popup-decoration error"></div>
        </div>
      ),
      footerContent: (
        <div className="d-flex gap-3">
          <Button 
            variant="outline-secondary" 
            onClick={hidePopup}
            className="px-4"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleSubmit}
            className="px-4"
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
      const response = await axios.post("sublime-magic-production.up.railway.app/contactUs", formData);
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
    <Container className="contact-us-container">
      <div className="contact-header-wrapper">
        <h2 className="contact-header">Get In Touch</h2>
        <div className="header-decoration"></div>
      </div>
      
      <Form onSubmit={handleSubmit} className="contact-form">
        <Form.Group controlId="name" className="mb-4 form-group">
          <div className="input-icon">
            <FaUser />
          </div>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="form-input"
          />
          <div className="input-highlight"></div>
        </Form.Group>

        <Form.Group controlId="email" className="mb-4 form-group">
          <div className="input-icon">
            <FaEnvelope />
          </div>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your Email"
            className="form-input"
          />
          <div className="input-highlight"></div>
        </Form.Group>

        <Form.Group controlId="subject" className="mb-4 form-group">
          <div className="input-icon">
            <FaTag />
          </div>
          <Form.Control
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Subject"
            className="form-input"
          />
          <div className="input-highlight"></div>
        </Form.Group>

        <Form.Group controlId="message" className="mb-4 form-group">
          <div className="input-icon">
            <FaComment />
          </div>
          <Form.Control
            as="textarea"
            rows={5}
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Your Message"
            className="form-input"
          />
          <div className="input-highlight"></div>
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          disabled={isSubmitting}
          className="submit-btn"
        >
          <FaPaperPlane className="me-2" />
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </Form>

      <Popup
        show={popupConfig.show}
        onHide={hidePopup}
        title={popupConfig.title}
        headerClass={popupConfig.headerClass}
        footerContent={popupConfig.footerContent}
        bodyClass="py-4 px-3"
      >
        {popupConfig.content}
      </Popup>
    </Container>
  );
};

export default ContactUs;