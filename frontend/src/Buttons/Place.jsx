import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const Places = () => {
  const [museums, setMuseums] = useState([]);  // State to store museum data
  const [loading, setLoading] = useState(false);  // State to manage loading
  const [error, setError] = useState(null);    // State to manage errors
  const [searchParams, setSearchParams] = useSearchParams(); // Get the query params from the URL

  const city = searchParams.get('city');  // Get the 'city' query parameter

  useEffect(() => {
    const fetchMuseums = async () => {
      if (!city) return;  // Don't fetch if city is empty

      setLoading(true);    // Start loading
      setError(null);      // Clear previous errors

      try {
        // Fetch museums data based on the city from the URL
        const response = await axios.get(`http://127.0.0.1:8000/api/museums/?city=${city}`);
        console.log('Response:', response.data);  // Log response for debugging
        setMuseums(response.data);  // Update state with fetched data
      } catch (err) {
        console.error('Error fetching museum data:', err);  // Log error
        setError('Failed to fetch museums. Please try again.');
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    if (city) {
      fetchMuseums();  // Fetch museums if a city is available
    }
  }, [city]);  // Trigger the effect when the city query parameter changes

  // Function to handle search bar input and update URL
  const handleSearch = (event) => {
    setSearchParams({ city: event.target.value });  // Update the city in the URL query
  };

  return (
    <div className="container">
      <h1 className="mt-4">Museums in {city || '...'}</h1>

      <input
        type="text"
        placeholder="Search for a city"
        value={city || ''}
        onChange={handleSearch}
        className="form-control mb-4"
      />

      {loading && <p>Loading museums...</p>} {/* Show loading spinner */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}

      {!loading && !museums.length && city && (
        <p>No museums found for this city.</p>
      )} {/* Show message if no museums are found */}

      <div className="row">
        {museums.map((museum) => (
          <div key={museum.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={museum.image || '/static/default_museum_image.jpg'}  // Add fallback image
                className="card-img-top"
                alt={museum.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{museum.name}</h5>
                <p className="card-text">
                  <strong>Address:</strong> {museum.address} <br />
                  <strong>Fare:</strong> ${museum.fare} <br />
                  <strong>Timings:</strong>{' '}
                  {museum.time_slots.map((slot, index) => (
                    <span key={index}>{slot}<br /></span>
                  ))}
                  <strong>Closing Days:</strong>{' '}
                  {museum.closing_days.join(', ')} <br />
                  <strong>Details:</strong> {museum.other_details}
                </p>
                <Link to={`/museum/${museum.id}`} className="btn btn-primary">
                  More Details
                </Link>
                <button className="btn btn-success ms-2">Book Ticket</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Places;
