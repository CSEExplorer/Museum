import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const Places = () => {
  const [museums, setMuseums] = useState([]);  // Store museum data
  const [loading, setLoading] = useState(false);  // Manage loading state
  const [error, setError] = useState(null);    // Manage error state
  const [searchParams, setSearchParams] = useSearchParams();  // Get query params from URL
  const [selectedMuseum, setSelectedMuseum] = useState(null);  // Store selected museum for booking
  const [timeSlots, setTimeSlots] = useState([]);  // Store time slots
  const [showModal, setShowModal] = useState(false);  // Modal visibility
  const [selectedSlot, setSelectedSlot] = useState(null);  // Store selected time slot for booking
  const [city, setCity] = useState(searchParams.get('city') || '');  // Get city from search params

  // Fetch museums when the city query changes
  useEffect(() => {
    const fetchMuseums = async () => {
      if (!city) return;
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/museums/?city=${city}`);
        setMuseums(response.data);
      } catch (err) {
        setError('Failed to fetch museums. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMuseums();
  }, [city]);

  // Handle search bar input
  const handleSearch = (event) => {
    setCity(event.target.value);
    setSearchParams({ city: event.target.value });
  };

  // Fetch time slots when "Book Ticket" is clicked
  const handleBookTicket = async (museum) => {
    setSelectedMuseum(museum);
    setShowModal(true);  // Show modal
    setTimeSlots([]);  // Clear previous time slots

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/museums/${museum.id}/slots/`);
      setTimeSlots(response.data);
    } catch (err) {
      setError('Failed to fetch time slots. Please try again.');
    }
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    try {
      // Send booking request to the API
      const response = await axios.post(`http://127.0.0.1:8000/api/museums/${selectedMuseum.id}/book/`, {
        slot_id: selectedSlot.id,
      });
      alert('Booking successful!');
      setShowModal(false);  // Close modal
    } catch (err) {
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="mt-4">Museums in {city || '...'}</h1>

      <input
        type="text"
        placeholder="Search for a city"
        value={city}
        onChange={handleSearch}
        className="form-control mb-4"
      />

      {loading && <p>Loading museums...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !museums.length && city && (
        <p>No museums found for this city.</p>
      )}

      <div className="row">
        {museums.map((museum) => (
          <div key={museum.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={museum.image || '/static/default_museum_image.jpg'}
                className="card-img-top"
                alt={museum.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{museum.name}</h5>
                <p className="card-text">
                  <strong>Address:</strong> {museum.address} <br />
                  <strong>Fare:</strong> ${museum.fare} <br />
                  <strong>Details:</strong> {museum.other_details}
                </p>
                <button className="btn btn-success" onClick={() => handleBookTicket(museum)}>
                  Book Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to select time slots */}
      {selectedMuseum && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Book Ticket for {selectedMuseum.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmBooking}
              disabled={!selectedSlot}  // Disable button if no time slot is selected
            >
              Confirm Booking
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Places;
