import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');

            // Check if token exists
            if (!token) {
                console.warn('No token found. User might not be logged in.');
                navigate('/login');
                return;
            }

            // Make the logout request
            await axios.post('http://localhost:8000/api/logout/', null, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            // Remove the token from local storage
            localStorage.removeItem('token');
            
            // Redirect to login page or any other page
            navigate('/login');
        } catch (error) {
            // Log detailed error
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
