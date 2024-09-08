import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileAccount = () => {
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        address: '',
        phone_number: '',
        city: '',
        state: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ ...userDetails });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User is not authenticated');
                    return;
                }
                const response = await axios.get('http://localhost:8000/api/user/profile/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setUserDetails(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                setError('Could not load user details. Please try again later.');
            }
        };

        fetchUserDetails();
    }, []);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User is not authenticated');
                return;
            }
            await axios.put('http://localhost:8000/api/user/profile/', formData, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setUserDetails(formData);
            setEditMode(false);
            setError('');
        } catch (error) {
            console.error('Failed to update user details:', error);
            setError('Could not update user details. Please try again later.');
        }
    };

    return (
        <div style={containerStyle}>
            <h2>Profile Account</h2>
            {error ? (
                <div style={errorStyle}>{error}</div>
            ) : (
                <div>
                    {editMode ? (
                        <div>
                            <label>
                                <strong>Username:</strong>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled
                                />
                            </label>
                            <label>
                                <strong>Email:</strong>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <strong>Address:</strong>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <strong>Phone Number:</strong>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <strong>City:</strong>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <strong>State:</strong>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </label>
                            <button style={buttonStyle} onClick={handleSave}>Save</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Username:</strong> {userDetails.username}</p>
                            <p><strong>Email:</strong> {userDetails.email}</p>
                            <p><strong>Address:</strong> {userDetails.address}</p>
                            <p><strong>Phone Number:</strong> {userDetails.phone_number}</p>
                            <p><strong>City:</strong> {userDetails.city}</p>
                            <p><strong>State:</strong> {userDetails.state}</p>
                            <button style={buttonStyle} onClick={handleEdit}>Edit Profile</button>
                        </div>
                    )}
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
