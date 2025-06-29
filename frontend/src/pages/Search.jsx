import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const API_BASE_URL = 'http://localhost:5000';

const ResultCard = ({ name, email, batchmateId, onClick, userRole }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      border: '1px solid #e0e0e0'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
  >
    <h3 style={{ 
      margin: '0 0 8px 0', 
      color: '#333',
      fontSize: '18px',
      fontWeight: '600'
    }}>
      {name}
    </h3>
    <p style={{ 
      margin: '0', 
      color: '#666',
      fontSize: '14px'
    }}>
      {email}
    </p>
  </div>
);

// This is the main Search component, which contains all the state and logic.
export default function Search() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Type a name to search for batchmates.');

  // Debouncing logic to avoid sending API requests on every keystroke
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Data fetching logic that runs when the debounced search term changes
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      setError('');
      setMessage('Type a name to search for batchmates.');
      setLoading(false);
      return;
    }

    const fetchBatchmates = async () => {
      setLoading(true);
      setError('');
      setMessage('');
      setResults([]);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/batchmates/search?name=${encodeURIComponent(debouncedSearchTerm.trim())}`
        );
        setResults(response.data);
      } catch (err) {
        setResults([]);
        if (err.response) {
          if (err.response.status === 404) {
            setError(`No batchmates found matching "${debouncedSearchTerm}".`);
          } else {
            setError(err.response.data.error || 'An error occurred while fetching data.');
          }
        } else if (err.request) {
          setError('No response from server. Please check your network connection.');
        } else {
          setError('Unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBatchmates();
  }, [debouncedSearchTerm]);

  const handleInputChange = (e) => setSearchTerm(e.target.value);

  // CORRECTED: This is the click handler with the required navigation logic.
  const handleCardClick = (emailAddress) => {
    if (!emailAddress) return;
    
    // Extracts 'john.doe' from 'john.doe@accenture.com'
    const enterpriseId = emailAddress.split('@')[0];
    
    // Navigates to the correct profile URL
    navigate(`/profile/${enterpriseId}`);
  };

  return (
    <div style={{ fontFamily: '"Segoe UI", sans-serif' }}>
      <Navbar />
      <div style={{ padding: '40px 20px', backgroundColor: '#f9f9f9', minHeight: '100vh', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search by name..."
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

        {loading && (
          <p style={{ fontFamily: 'Segoe UI, sans-serif', color: '#555' }}>Loading...</p>
        )}

        {error && (
          <p style={{ fontFamily: 'Segoe UI, sans-serif', color: 'red' }}>{error}</p>
        )}

        {!loading && !error && results.length > 0 && (
          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 10px',
            }}>
            {results.map((batchmate) => (
              <ResultCard
                key={batchmate._id}
                name={batchmate.name}
                email={batchmate.email_address}
                batchmateId={batchmate._id}
                onClick={() => handleCardClick(batchmate.email_address)}
                userRole={user?.role}
              />
            ))}
          </div>
        )}

        {!loading && !error && results.length === 0 && message && (
          <p style={{ fontFamily: 'Segoe UI, sans-serif', color: '#555' }}>{message}</p>
        )}
      </div>
    </div>
  );
}