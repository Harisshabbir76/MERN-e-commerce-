import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner, Button } from 'react-bootstrap';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
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

                if (response.data.user?.email?.toLowerCase() === 'Haris99@gmail.com') {
                    setIsAuthorized(true);
                    // Redirect to order management if accessing root dashboard
                    if (location.pathname === '/dashboard') {
                        navigate('/dashboard/order-management');
                    }
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
    }, [navigate, location.pathname]);

    if (isLoading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading dashboard...</p>
            </Container>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <Container className="py-5">
            <h1 className="mb-4">Admin Dashboard</h1>
            <div className="d-flex flex-wrap gap-3">
                <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => navigate('/dashboard/add-product')}
                    className="p-4"
                >
                    Add New Product
                </Button>
                <Button 
                    variant="success" 
                    size="lg"
                    onClick={() => navigate('/dashboard/order-management')}
                    className="p-4"
                >
                    Order Management
                </Button>
                <Button 
                    variant="info" 
                    size="lg"
                    onClick={() => navigate('/dashboard/contactus')}
                    className="p-4"
                >
                    Customer Messages
                </Button>
                <Button 
                    variant="info" 
                    size="lg"
                    onClick={() => navigate('/dashboard/catalog')}
                    className="p-4"
                >
                    Products
                </Button>
                <Button 
                    variant="info" 
                    size="lg"
                    onClick={() => navigate('/dashboard/analytics')}
                    className="p-4"
                >
                    Analytics
                </Button>
            </div>
        </Container>
    );
}