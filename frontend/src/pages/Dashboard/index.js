import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner, Button } from 'react-bootstrap';

export default function Dashboard() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('https://mern-e-commerce-f9ra.onrender.com/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Check authorization without redirect
                if (response.data.user?.email === 'Haris99@gmail.com') {
                    setIsAuthorized(true);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading dashboard...</p>
            </Container>
        );
    }

    if (!isAuthorized) {
        return (
            <Container className="text-center py-5">
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Return to Home
                </Button>
            </Container>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Admin Dashboard</h1>
                <Button 
                    variant="danger" 
                    onClick={handleLogout}
                    className="ms-3"
                >
                    Logout
                </Button>
            </div>
            
            <div className="d-flex flex-wrap gap-3">
                <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => navigate('/dashboard/add-product')}
                    className="p-4 flex-grow-1"
                >
                    Add New Product
                </Button>
                <Button 
                    variant="success" 
                    size="lg"
                    onClick={() => navigate('/dashboard/order-management')}
                    className="p-4 flex-grow-1"
                >
                    Order Management
                </Button>
                <Button 
                    variant="info" 
                    size="lg"
                    onClick={() => navigate('/dashboard/contactus')}
                    className="p-4 flex-grow-1"
                >
                    Customer Messages
                </Button>
                <Button 
                    variant="info" 
                    size="lg"
                    onClick={() => navigate('/dashboard/catalog')}
                    className="p-4 flex-grow-1"
                >
                    Products Catalog
                </Button>
                <Button 
                    variant="info" 
                    size="lg"
                    onClick={() => navigate('/dashboard/analytics')}
                    className="p-4 flex-grow-1"
                >
                    Sales Analytics
                </Button>
            </div>
        </Container>
    );
}