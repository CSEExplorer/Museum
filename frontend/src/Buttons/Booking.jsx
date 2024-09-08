import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

const Booking = () => {
  const location = useLocation();  // Access the passed state (museum data)
  const navigate = useNavigate();
  const { museum } = location.state || {};  // Get museum from state
  const [timeSlots, setTimeSlots] = useState([]);  // Store time slots
  const [selectedSlot, setSelectedSlot] = useState(null);  // Store selected time slot
  const [email, setEmail] = useState('');  // Store email input
  const [error, setError] = useState(null);  // Manage error state
  const [loading, setLoading] = useState(false);  // Manage loading state

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

    fetchTimeSlots();
  }, [museum]);

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !email) return;  // Ensure email is also provided

    setLoading(true);  // Show loading indicator

    try {
      await axios.post(`http://127.0.0.1:8000/api/museums/${museum.id}/book/`, {
        slot_id: selectedSlot.id,
        email: email,  // Include email in booking request
      });
      alert('Booking successful!');
      navigate('/');  // Redirect to homepage after booking
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);  // Hide loading indicator
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
            disabled={!selectedSlot || !email || loading}  // Disable button if no slot or email, or if loading
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
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
