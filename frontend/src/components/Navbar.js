import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
  Form,
  InputGroup,
  Badge,
  Image,
  Offcanvas
} from 'react-bootstrap';
import { 
  FiShoppingBag, 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiUser,
  FiLogOut,
  FiHome,
  FiShoppingCart,
  FiGrid,
  FiInfo,
  FiMail
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';
import logo from '../images/logo.png';

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  const navLinks = [
    { name: 'Home', path: '/', icon: <FiHome size={18} /> },
    { name: 'New Arrivals', path: '/new-arrivals', icon: <FiShoppingCart size={18} /> },
    { name: 'Catalog', path: '/catalog', icon: <FiShoppingCart size={18} /> },
    { name: 'Categories', path: '/category', icon: <FiGrid size={18} /> },
    { name: 'About', path: '/about-us', icon: <FiInfo size={18} /> },
    { name: 'Contact Us', path: '/contact-us', icon: <FiMail size={18} /> }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.get('https://mern-e-commerce-yjbp.vercel.app/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      setIsLoggedIn(false);
      navigate('/');
      setShowSidebar(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <BootstrapNavbar 
        expand="md" 
        sticky="top" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(102,126,234,0.95) 0%, rgba(118,75,162,0.95) 100%)',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          borderBottom: 'none'
        }}
      >
        <Container fluid="md">
          {/* Logo */}
          <BootstrapNavbar.Brand as={Link} to="/">
            <Image 
              src={logo} 
              alt="Company Logo"
              style={{
                height: '40px',
                width: 'auto',
                maxWidth: '150px',
                objectFit: 'contain'
              }}
            />
          </BootstrapNavbar.Brand>

          {/* Mobile menu and search buttons */}
          <div className="d-flex align-items-center">
            <Button 
              variant="link" 
              className="d-md-none p-2 me-2"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              style={{ color: 'white' }}
            >
              <FiSearch size={18} />
            </Button>
            
            <Button 
              variant="link" 
              className="d-md-none p-2"
              onClick={() => setShowSidebar(true)}
              style={{ color: 'white' }}
            >
              <FiMenu size={20} />
            </Button>
          </div>

          {/* Desktop Navigation */}
          <BootstrapNavbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {navLinks.map((link) => (
                <Nav.Link 
                  key={link.path}
                  as={Link}
                  to={link.path}
                  active={location.pathname === link.path}
                  style={{
                    margin: '0 0.25rem',
                    borderRadius: '0.375rem',
                    color: location.pathname === link.path ? 'white' : 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                    textShadow: location.pathname === link.path ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                    ...(location.pathname === link.path && {
                      backgroundColor: 'rgba(255,255,255,0.2)'
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.target.style.color = 'white';
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.target.style.color = 'rgba(255,255,255,0.9)';
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.name}
                </Nav.Link>
              ))}
            </Nav>

            {/* Right side icons */}
            <div className="d-flex align-items-center">
              <Button 
                variant="link" 
                className="d-none d-md-block p-2 me-1"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                style={{ color: 'white' }}
              >
                <FiSearch size={18} />
              </Button>
              
              <Button 
                variant="link" 
                className="p-2 me-1"
                onClick={isLoggedIn ? handleLogout : undefined}
                as={isLoggedIn ? 'button' : Link}
                to={isLoggedIn ? undefined : '/login'}
                style={{ color: 'white' }}
              >
                {isLoggedIn ? <FiLogOut size={18} /> : <FiUser size={18} />}
              </Button>
              
              <Button 
                variant="link" 
                className="p-2 position-relative"
                as={Link}
                to="/cart"
                style={{ color: 'white' }}
              >
                <FiShoppingBag size={18} />
                {cartCount > 0 && (
                  <Badge 
                    pill 
                    bg="light"
                    text="dark"
                    style={{
                      position: 'absolute',
                      top: '-0.25rem',
                      right: '-0.25rem',
                      fontSize: '0.625rem',
                      height: '1rem',
                      width: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </BootstrapNavbar.Collapse>
        </Container>

        {/* Mobile Sidebar */}
        <Offcanvas
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          placement="end"
          style={{ width: '280px' }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {navLinks.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: location.pathname === link.path ? '#4f46e5' : '#1f2937',
                    backgroundColor: location.pathname === link.path ? '#e0e7ff' : 'transparent',
                    marginBottom: '0.25rem',
                    textDecoration: 'none'
                  }}
                  onClick={() => setShowSidebar(false)}
                >
                  <span className="me-3">{link.icon}</span>
                  {link.name}
                </Nav.Link>
              ))}
              
              <div className="mt-3 pt-2 border-top">
                <Nav.Link
                  as={Link}
                  to={isLoggedIn ? undefined : '/login'}
                  onClick={() => {
                    if (isLoggedIn) {
                      handleLogout();
                    }
                    setShowSidebar(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: '#1f2937',
                    textDecoration: 'none'
                  }}
                >
                  <span className="me-3">
                    {isLoggedIn ? <FiLogOut size={18} /> : <FiUser size={18} />}
                  </span>
                  {isLoggedIn ? 'Logout' : 'Login'}
                </Nav.Link>
              </div>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Search Bar */}
        {isSearchOpen && (
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'linear-gradient(135deg, rgba(102,126,234,0.98) 0%, rgba(118,75,162,0.98) 100%)',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              zIndex: 1040,
              padding: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Container fluid="md">
              <Form onSubmit={handleSearch} className="d-flex align-items-center">
                <InputGroup style={{ flex: 1 }}>
                  <InputGroup.Text 
                    style={{ 
                      backgroundColor: 'transparent',
                      borderRight: 'none',
                      position: 'absolute',
                      left: '0.75rem',
                      zIndex: 5,
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)'
                    }}
                  >
                    <FiSearch size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search our collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      paddingLeft: '2.5rem',
                      borderRadius: '0.5rem',
                      borderColor: 'rgba(255,255,255,0.2)',
                      boxShadow: 'none',
                      backgroundColor: 'rgba(255,255,255,0.9)'
                    }}
                    autoFocus
                  />
                </InputGroup>
                <Button 
                  variant="link" 
                  className="ms-3 p-2"
                  onClick={() => setIsSearchOpen(false)}
                  style={{ color: 'white' }}
                >
                  <FiX size={20} />
                </Button>
              </Form>
            </Container>
          </div>
        )}
      </BootstrapNavbar>
    </>
  );
};

export default Navbar;