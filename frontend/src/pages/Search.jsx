import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// ResultCard component (assuming it's in the same file or imported correctly)
const cardStyle = {
  border: '1px solid #e0e0e0',
  padding: '16px',
  marginBottom: '16px',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  maxWidth: '400px', // To match input width
  margin: '0 auto 16px', // Centering
};

const ResultCard = ({ name, email }) => (
  <div
    style={cardStyle}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [result, setResult] = useState(null); // API returns a single object or 404
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Type a name to search for batchmates.');

  // Debounce effect for search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // API call effect when debouncedSearchTerm changes
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResult(null);
      setError('');
      setMessage('Type a name to search for batchmates.');
      setLoading(false); // Ensure loading is false if search term is cleared
      return;
    }

    const fetchBatchmate = async () => {
      setLoading(true);
      setError('');
      setResult(null); // Clear previous result
      setMessage(''); // Clear any previous general message

      try {
        // Note: Your backend route is /api/batchmates/search?name=...
        // The path parameter :name in your backend route definition /api/batchmates/search/:name
        // seems to be a slight mismatch with how query parameters are usually handled.
        // For a query like /search?name=John, req.query.name is used.
        // If your backend is strictly /search/:name, the URL should be:
        // `${API_BASE_URL}/api/batchmates/search/${encodeURIComponent(debouncedSearchTerm.trim())}`
        // But your backend controller uses req.query.name, so /search?name=... is correct.
        const response = await axios.get(
          `${API_BASE_URL}/api/batchmates/search?name=${encodeURIComponent(debouncedSearchTerm.trim())}`
        );
        setResult(response.data);
      } catch (err) {
        setResult(null); // Clear result on error
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
        <ResultCard name={result.name} email={result.emailAddress} />
      )}
      
      {!loading && !error && !result && message && (
        <p style={{ fontFamily: 'Segoe UI, sans-serif', color: '#555' }}>{message}</p>
      )}

      {/* Example static cards removed, results will be dynamic */}
      {/* <ResultCard name="Alice Johnson" email="alice@example.com" /> */}
      {/* <ResultCard name="Bob Smith" email="bob@example.com" /> */}
    </div>
  );
}