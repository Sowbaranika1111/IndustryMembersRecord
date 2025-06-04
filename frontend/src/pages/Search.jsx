import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const API_BASE_URL = 'http://localhost:5000';

const cardStyle = {
  border: '1px solid #e0e0e0',
  padding: '16px',
  marginBottom: '16px',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  maxWidth: '400px',
  margin: '0 auto 16px',
  cursor: 'pointer', // 2. Add cursor pointer to indicate clickability
};

// 3. Modify ResultCard to accept id and onClick props
const ResultCard = ({ id, name, email, onClick }) => (
  <div
    style={cardStyle}
    onClick={() => onClick(id)} // Call onClick with the id
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
    }}
  >
    <h3 style={{ margin: '0 0 8px', fontFamily: 'Segoe UI, sans-serif', color: '#333' }}>{name}</h3>
    <p style={{ margin: 0, color: '#555', fontFamily: 'Roboto, sans-serif' }}>{email}</p>
  </div>
);

export default function Search() {
  const navigate = useNavigate(); // 4. Initialize useNavigate
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Type a name to search for batchmates.');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResult(null);
      setError('');
      setMessage('Type a name to search for batchmates.');
      setLoading(false);
      return;
    }

    const fetchBatchmate = async () => {
      setLoading(true);
      setError('');
      setResult(null);
      setMessage('');

      try {
        // Assuming backend uses findOne and returns single object or 404
        const response = await axios.get(
          `${API_BASE_URL}/api/batchmates/search?name=${encodeURIComponent(debouncedSearchTerm.trim())}`
        );
        setResult(response.data); // response.data is a single object
      } catch (err) {
        setResult(null);
        if (err.response) {
          if (err.response.status === 404) {
            setError(`No batchmate found with the name "${debouncedSearchTerm}".`);
          } else if (err.response.status === 400) {
            setError(err.response.data.error || 'Invalid search query. Name parameter is required.');
          } else {
            setError(err.response.data.error || 'An error occurred while fetching data.');
          }
        } else if (err.request) {
          setError('No response from server. Please check your network connection.');
        } else {
          setError('Error setting up the search request.');
        }
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatchmate();
  }, [debouncedSearchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 5. Define the click handler for the card
  const handleCardClick = (batchmateId) => {
    if (batchmateId) {
      navigate(`/profile/${batchmateId}`); // Navigate to profile page with ID
    }
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f9f9f9', minHeight: '100vh', textAlign: 'center' }}>
      <input
        type="text"
        placeholder="Search by exact name (case-insensitive)..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{
          padding: '12px 16px',
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto 30px',
          display: 'block',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '16px',
          fontFamily: 'Segoe UI, sans-serif',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      />

      {loading && <p style={{ fontFamily: 'Segoe UI, sans-serif', color: '#555' }}>Loading...</p>}
      
      {error && <p style={{ fontFamily: 'Segoe UI, sans-serif', color: 'red' }}>{error}</p>}
      
      {!loading && !error && result && (
        // 6. Pass id and onClick handler to ResultCard
        <ResultCard
          id={result._id} // Assuming your result object has an _id field
          name={result.name}
          email={result.emailAddress} // Mongoose schema uses emailAddress
          onClick={handleCardClick}
        />
      )}
      
      {!loading && !error && !result && message && (
        <p style={{ fontFamily: 'Segoe UI, sans-serif', color: '#555' }}>{message}</p>
      )}
    </div>
  );
}