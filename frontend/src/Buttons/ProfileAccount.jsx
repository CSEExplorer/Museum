import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileAccount = () => {
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        address: '',
        phone_number: '',
        city: '',
        state: '',
        profile_image: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ ...userDetails });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

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
                if (response.data.profile_image) {
                    setImagePreview(response.data.profile_image);
                }
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User is not authenticated');
                return;
            }

            const data = new FormData();
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('address', formData.address);
            data.append('phone_number', formData.phone_number);
            data.append('city', formData.city);
            data.append('state', formData.state);
            if (selectedImage) {
                data.append('profile_image', selectedImage);
            }

            await axios.put('http://localhost:8000/api/user/profile/', data, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
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
            <div style={profileHeaderStyle}>
                <div style={imageContainerStyle}>
                    {imagePreview ? (
                        <img src={imagePreview} alt="Profile" style={imageStyle} />
                    ) : (
                        <div style={placeholderImageStyle}>No Image</div>
                    )}
                    {editMode && (
                        <div>
                            <input type="file" onChange={handleImageChange} />
                        </div>
                    )}
                </div>
                <div style={infoContainerStyle}>
                    <h2>Profile Account</h2>
                    {error ? (
                        <div style={errorStyle}>{error}</div>
                    ) : (
                        <div>
                            {editMode ? (
                                <div style={formStyle}>
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
            </div>
        </div>
    );
};

const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FAFAFA'
};

const profileHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
};

const imageContainerStyle = {
    flexShrink: 0,
};

const imageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
};

const placeholderImageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ccc',
    fontSize: '18px'
};

const infoContainerStyle = {
    flexGrow: 1
};

const formStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
};

const buttonStyle = {
    gridColumn: 'span 2',
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
