import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const Places = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [city, setCity] = useState(searchParams.get('city') || '');
  const navigate = useNavigate();

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

  const handleSearch = (event) => {
    setCity(event.target.value);
    setSearchParams({ city: event.target.value });
  };

  const handleBookTicket = (museum) => {
    navigate('/booking', { state: { museum } });
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
    </div>
  );
};

export default Places;
