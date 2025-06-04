import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import industryXBG from '../assets/image.png'; // Make sure this path is correct

const API_BASE_URL = 'http://localhost:5000'; // Define your API base URL

// ResultCard component (copied from Search.js or make it a shared component)
const cardStyle = {
  border: '1px solid #e0e0e0',
  padding: '16px',
  marginBottom: '16px',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  maxWidth: '400px',
  margin: '0 auto 16px', // Centered, with bottom margin
  cursor: 'pointer',
  textAlign: 'left', // Align text to left within card
};

const ResultCard = ({ id, name, email, onClick }) => (
  <div
    style={cardStyle}
    onClick={() => onClick(id)}
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

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null); // Renamed from 'result' to avoid conflict
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Initially no message until user types

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch batchmate data when debouncedSearchTerm changes
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResult(null);
      setError('');
      // Optional: Set a message if you want to guide user when input is cleared
      // setMessage('Type a name to search.');
      setMessage(''); // Clear message when input is empty
      setLoading(false);
      return;
    }

    const fetchBatchmate = async () => {
      setLoading(true);
      setError('');
      setSearchResult(null);
      setMessage('');

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/batchmates/search?name=${encodeURIComponent(debouncedSearchTerm.trim())}`
        );
        setSearchResult(response.data); // Expecting a single object or null if not found by backend
        if (!response.data) {
            setMessage(`No batchmate found with the name "${debouncedSearchTerm}".`);
        }
      } catch (err) {
        setSearchResult(null);
        if (err.response) {
          if (err.response.status === 404) {
            // This specific message is now handled above if response.data is null/empty
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
    if (!e.target.value.trim()) { // If input is cleared, also clear results immediately
        setSearchResult(null);
        setError('');
        setMessage('');
    } else {
        setMessage('Searching...'); // Or keep it empty until results or error
    }
  };

  const handleCardClick = (batchmateId) => {
    if (batchmateId) {
      navigate(`/profile/${batchmateId}`);
    }
  };

  return (
    <div style={{ fontFamily: '"Segoe UI", sans-serif' }}>
      {/* Header with image and overlay search */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at center, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.5) 100%),
            url(${industryXBG})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <input
          type="text"
          placeholder="Search by name..." // Updated placeholder
          value={searchTerm}
          onChange={handleInputChange}
          style={{
            position: 'absolute',
            bottom: '50%', // Positioned in the middle of the header
            left: '50%',
            transform: 'translate(-50%, 50%)', // Centered properly
            padding: '12px 20px',
            fontSize: '16px',
            width: '80%',
            maxWidth: '500px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1,
          }}
        />
      </div>

      {/* Search Results Section - Displayed below the header */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        {loading && <p style={{ color: '#555' }}>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && searchResult && (
          <ResultCard
            id={searchResult._id} // Assuming your result object has an _id field
            name={searchResult.name}
            email={searchResult.emailAddress} // Ensure this matches your API response field
            onClick={handleCardClick}
          />
        )}
        {/* Display message if API returns no data or for other guiding texts */}
        {!loading && !error && !searchResult && message && searchTerm.trim() && (
            <p style={{ color: '#555' }}>{message}</p>
        )}
      </div>

      {/* Content below the header and search results */}
      <div style={{ display: 'flex', padding: '0 20px 30px 20px', gap: '20px', flexWrap: 'wrap' }}>
        {/* Left section: text */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h2 style={{ color: '#A100FF' }}>About Industry X</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
            Industry X is Accenture’s digital transformation initiative focused on smart manufacturing, connected products,
            and the future of operations. We combine innovation, technology, and engineering to transform traditional
            industries and build more agile, efficient, and sustainable operations.
          </p>
        </div>

        {/* Right section: image */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{
            width: '100%',
            height: '200px', // Or make height auto/aspect-ratio based for responsiveness
            backgroundColor: '#eee',
            backgroundImage: 'url("https://cdn.slidesharecdn.com/ss_thumbnails/industryx-170907025737-thumbnail-4.jpg?cb=1504808605")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px'
          }} />
        </div>
      </div>
    </div>
  );
}