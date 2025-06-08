import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { FaTrash, FaUpload } from 'react-icons/fa';

const ProductEditModal = ({ show, product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    discountedPrice: 0,
    description: '',
    category: '',
    stock: 0,
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || 0,
        discountedPrice: product.discountedPrice || 0,
        description: product.description || '',
        category: product.category || '',
        stock: product.stock || 0,
        images: product.image || []
      });
      setNewImages([]);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'discountedPrice' || name === 'stock' 
        ? Number(value) 
        : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageUploading(true);
    
    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        
        return axios.post(
          'https://sublime-magic-production.up.railway.app/upload', 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
          }
        );
      });

      const responses = await Promise.all(uploadPromises);
      const uploadedImages = responses.map(res => res.data.url);
      
      setNewImages(prev => [...prev, ...uploadedImages]);
      setImageUploading(false);
    } catch (err) {
      setError('Failed to upload images');
      setImageUploading(false);
    }
  };

  const removeImage = (index, isNewImage) => {
    if (isNewImage) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedProduct = {
        ...formData,
        image: [...formData.images, ...newImages] // Combine existing and new images
      };

      const response = await axios.put(
        `https://sublime-magic-production.up.railway.app/update/${product._id}`,
        updatedProduct,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      
      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://sublime-magic-production.up.railway.app${imagePath}`;
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Discounted Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ minHeight: '150px' }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-4">
                <Form.Label>Product Images</Form.Label>
                <div className="border p-3 rounded" style={{ minHeight: '200px' }}>
                  {/* Existing Images */}
                  <div className="mb-3">
                    <h6>Current Images</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.images.map((img, index) => (
                        <div key={`existing-${index}`} className="position-relative" style={{ width: '100px' }}>
                          <Image 
                            src={getImageUrl(img)} 
                            thumbnail 
                            style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index, false)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* New Images */}
                  <div className="mb-3">
                    <h6>New Images</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {newImages.map((img, index) => (
                        <div key={`new-${index}`} className="position-relative" style={{ width: '100px' }}>
                          <Image 
                            src={img} 
                            thumbnail 
                            style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index, true)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Button */}
                  <div className="text-center mt-3">
                    <Form.Label 
                      htmlFor="image-upload"
                      className="btn btn-primary w-100"
                      disabled={imageUploading}
                    >
                      {imageUploading ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        <>
                          <FaUpload className="me-2" />
                          Upload Images
                        </>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      id="image-upload"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      accept="image/*"
                      disabled={imageUploading}
                    />
                    <Form.Text className="text-muted">
                      Upload product images (max 10)
                    </Form.Text>
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading || imageUploading}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductEditModal;