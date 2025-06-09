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
                // Get token from localStorage
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Verify token and get user data
                const response = await axios.get('https://sublime-magic-production.up.railway.app/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Check if user is admin (case-insensitive)
                if (response.data.user.email.toLowerCase() === 'admin@gmail.com') {
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
        return null; // Redirect will happen in useEffect
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