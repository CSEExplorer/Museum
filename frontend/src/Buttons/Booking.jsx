import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { museum } = location.state || {};
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: location } });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate, location]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!museum) return;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/museums/${museum.id}/slots/`);
        setTimeSlots(response.data);
      } catch (err) {
        setError('Failed to fetch time slots. Please try again.');
      }
    };
    if (isAuthenticated) {
      fetchTimeSlots();
    }
  }, [museum, isAuthenticated]);

  const handlePayment = async (order) => {
    const { amount, id: id } = order;
    if (typeof window.Razorpay === "undefined") {
    alert("Razorpay SDK is not loaded. Please check your connection or script inclusion.");
    return;
  }
    const options = {
      key: "rzp_test_qRwrfdLBNDfLRV",  // Razorpay Key ID
      amount: amount,  // Amount in paise
      currency: "INR",
      name: museum.name,
      description: "Museum Ticket Booking",
      order_id: id,
      handler: async (response) => {
        // After successful payment, verify payment
        try {
          await axios.post('http://localhost:8000/api/verify_payment/', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            email: email,  // Include email to send booking confirmation
            slot_id: selectedSlot.id
          });
          alert('Payment successful! Booking confirmed.');
          // Send email as PDF
          await axios.post('http://localhost:8000/api/send_email/', { email, slot_id: selectedSlot.id });
          navigate('/');
        } catch (error) {
          alert('Payment verification failed.');
        }
      },
      prefill: {
        email: email,
        contact: '9999999999',
      },
      theme: {
        color: "#3399cc",
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !email) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Create Razorpay order
      const response = await axios.post(`http://127.0.0.1:8000/api/museums/${museum.id}/create_order/`, {
        amount: 100,
        email: email,
      }, {
        headers: {
          Authorization: `Token ${token}`,
        }
      });

      const order = response.data;  // Get order_id from the backend
      handlePayment(order);  // Initiate payment
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {museum ? (
        <>
          <h1 className="mt-4">Book Ticket for {museum.name}</h1>
          <h5>Select a Time Slot:</h5>

          {timeSlots.length > 0 ? (
            <ul className="list-group">
              {timeSlots.map((slot) => (
                <li
                  key={slot.id}
                  className={`list-group-item ${selectedSlot && selectedSlot.id === slot.id ? 'active' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                  style={{ cursor: 'pointer' }}
                >
                  {slot.start_time} - {slot.end_time} (Tickets Available: {slot.available_tickets})
                </li>
              ))}
            </ul>
          ) : (
            <p>No available time slots</p>
          )}

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleConfirmBooking}
            disabled={!selectedSlot || !email || loading}
          >
            {loading ? 'Booking...' : 'Book Ticket'}
          </Button>
        </>
      ) : (
        <p>No museum selected</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Booking;

