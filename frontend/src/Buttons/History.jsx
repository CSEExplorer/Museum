import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('/api/bookings/');
                if (Array.isArray(response.data)) {
                    setBookings(response.data);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching booking history:', error);
                setError('Failed to fetch booking history.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div style={styles.historyContainer}>
            <h2>Booking History</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={styles.cardsContainer}>
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.id} style={styles.card}>
                            <h3>Museum ID: {booking.museum}</h3>
                            <p>User ID: {booking.user}</p>
                            <p>Tickets: {booking.number_of_tickets}</p>
                            <p>Date of Visit: {booking.date_of_visit}</p>
                        </div>
                    ))
                ) : (
                    <p>No booking history available.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    historyContainer: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    cardsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '15px',
        backgroundColor: '#f9f9f9'
    }
};

export default History;
