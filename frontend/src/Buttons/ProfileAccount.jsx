import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileAccount = () => {
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        // Add more fields if needed
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                     setError('User is not authenticated');
                    return;
            }
                const response = await axios.get('http://localhost:8000/api/profile/', {
            headers: {
               Authorization: `Token ${token}`,  // Use 'Token' instead of 'Bearer'
             },
        });
            setUserDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                setError('Could not load user details. Please try again later.');
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div style={containerStyle}>
            <h2>Profile Account</h2>
            {error ? (
                <div style={errorStyle}>{error}</div>
            ) : (
                <div>
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    {/* Display other details as needed */}
                    <button style={buttonStyle}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FAFAFA'
};

const buttonStyle = {
    backgroundColor: '#007bff',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
};

const errorStyle = {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px'
};

export default ProfileAccount;
