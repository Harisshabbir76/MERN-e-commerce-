import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                    navigate('/404');
                    return;
                }

                // Verify token and get user data
                const response = await axios.get('http://localhost:5000/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Check if user is admin
                if (response.data.user.email === 'Admin@gmail.com') {
                    setIsAuthorized(true);
                } else {
                    navigate('/404');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/404');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return null; // Redirect will happen in useEffect
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
            <p>Here you can manage your account, view statistics, and more.</p>
            <p>Use the navigation menu to access different sections of the application.</p>
            <button onClick={() => navigate('/dashboard/add-product')}>Add Product</button>
            <button onClick={() => navigate('/dashboard/order-management')}>Order Management</button>
        </div>
    );
}