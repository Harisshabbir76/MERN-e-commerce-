import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner, 
  Alert,
  Badge,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import FilterComponent from '../components/Filter';
import ProductEditModal from '../components/ProductEditModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import '../App.css';

export default function AdminProductsDashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://sublime-magic-production.up.railway.app/catalog', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = res.data;

        let products = [];

        if (Array.isArray(data)) {
          products = data;
        } else if (data && Array.isArray(data.data)) {
          products = data.data;
        } else if (data && Array.isArray(data.products)) {
          products = data.products;
        } else {
          throw new Error('Unexpected API response: expected an array of products');
        }

        const processedProducts = products.map(product => ({
          ...product,
          stock: product.stock !== undefined ? product.stock : 0,
          rating: product.averageRating || 0,
          reviewCount: product.reviewCount || 0,
          price: product.discountedPrice || product.price || 0,
          createdAt: product.createdAt ? new Date(product.createdAt) : new Date()
        }));

        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    let sortedProducts = [...products];

    switch (sortOption) {
      case 'price-high-low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'price-low-high':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'rating-high':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => b.createdAt - a.createdAt);
        break;
      default:
        break;
    }

    setFilteredProducts(sortedProducts);
  }, [sortOption, products]);

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const getProductImage = (product) => {
    if (!product?.image?.[0]) return '/placeholder.jpg';
    if (product.image[0].startsWith('http')) return product.image[0];
    return `https://sublime-magic-production.up.railway.app${product.image[0]}`;
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://sublime-magic-production.up.railway.app/admin/delete/${selectedProduct._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleSave = (updatedProduct) => {
    setProducts(products.map(p => 
      p._id === updatedProduct._id ? updatedProduct : p
    ));
    setShowEditModal(false);
  };

  const renderProductCard = (product) => (
    <Col key={product._id || product.id}>
      <Card className="product-card h-100 border-0 shadow-sm">
        <div className="product-image-container">
          <Card.Img
            variant="top"
            src={getProductImage(product)}
            alt={product.name}
            className="product-img"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
          {product.discountedPrice < product.originalPrice && (
            <div className="discount-badge">
              {Math.round(100 - (product.discountedPrice / product.originalPrice) * 100)}% OFF
            </div>
          )}
          <Badge 
            bg={product.stock > 0 ? "success" : "danger"} 
            className="stock-badge"
          >
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="product-title">{product.name}</Card.Title>
          <Card.Text className="text-muted product-category">
            {product.category || 'Uncategorized'}
          </Card.Text>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="price">
                {product.discountedPrice < product.originalPrice && (
                  <span className="original-price text-muted text-decoration-line-through me-2">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="current-price fw-bold">
                  ${product.discountedPrice || product.price}
                </span>
              </div>
              <div className="rating">
                {product.reviewCount > 0 ? (
                  <>
                    <FaStar className="text-warning" />
                    <span className="ms-1">{product.rating.toFixed(1)}</span>
                    <small className="text-muted ms-1">({product.reviewCount})</small>
                  </>
                ) : (
                  <small className="text-muted">No reviews yet</small>
                )}
              </div>
            </div>
            <ButtonGroup className="w-100">
              <Button 
                variant="outline-primary" 
                onClick={() => handleEdit(product)}
              >
                <FaEdit /> Edit
              </Button>
              <Button 
                variant="outline-danger" 
                onClick={() => handleDelete(product)}
              >
                <FaTrash /> Delete
              </Button>
            </ButtonGroup>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container className="admin-products-dashboard py-3 py-md-5">
      <div className="page-header-wrapper mb-4 mb-md-5">
        <h1 className="page-header">Products Management</h1>
        
        <FilterComponent 
          sortOption={sortOption} 
          onSortChange={handleSortChange} 
        />
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading products...</p>
        </div>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filteredProducts.map(product => renderProductCard(product))}
          </Row>

          <ProductEditModal
            show={showEditModal}
            product={selectedProduct}
            onClose={() => setShowEditModal(false)}
            onSave={handleSave}
          />

          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            productName={selectedProduct?.name || 'this product'}
          />
        </>
      )}
    </Container>
  );
}