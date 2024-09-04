import React from 'react';

const Tickets = () => {
  return (
    <div
      style={{
        width: '350px',
        margin: '20px auto',
        padding: '20px',
        border: '2px solid #007bff',
        borderRadius: '10px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '20px' }}>
        Museum Ticket
      </h2>

      <div style={{ marginBottom: '15px' }}>
        <strong>Event:</strong> <span>The Art of the Renaissance</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Date:</strong> <span>September 15, 2024</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Time:</strong> <span>10:00 AM - 12:00 PM</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Seat No:</strong> <span>A23</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <img
          src="https://via.placeholder.com/100"
          alt="QR Code"
          style={{ borderRadius: '5px' }}
        />
      </div>

      <p style={{ textAlign: 'center', marginTop: '15px', color: '#6c757d' }}>
        Present this ticket at the entrance.
      </p>
    </div>
  );
};

export default Tickets;
