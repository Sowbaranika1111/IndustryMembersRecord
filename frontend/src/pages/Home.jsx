import React from 'react';
import { useNavigate } from 'react-router-dom';
import industryXBG from '../assets/image.png';

export default function Home() {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div style={{ fontFamily: '"Segoe UI", sans-serif' }}>
      {/* Header Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center'
      }}>
        {/* Faded Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
    linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
    url(${industryXBG})
  `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          filter: 'brightness(0.3)'
        }} />


        {/* Text and Button */}
        <div style={{ zIndex: 1 }}>
          <h1 style={{
            fontSize: '60px',
            fontWeight: 'normal',
            color: '#ffffff',
            marginBottom: '20px',
            fontFamily: '"EB Garamond", serif'
          }}>
            Welcome to Industry X Market
          </h1>

          <button
            onClick={handleSearchClick}
            style={{
              backgroundColor: '#6a0dad',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5900b3'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6a0dad'}
          >
            Go to Search
          </button>
        </div>
      </div>

      {/* About Section */}
      <div style={{ display: 'flex', padding: '40px 20px', gap: '20px', flexWrap: 'wrap' }}>
        {/* Text */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h2 style={{ color: '#6a0dad' }}>About Industry X</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
            Industry X is Accenture’s digital transformation initiative focused on smart manufacturing,
            connected products, and the future of operations. We combine innovation, technology, and
            engineering to transform traditional industries and build more agile, efficient, and
            sustainable operations.
          </p>
        </div>

        {/* Image */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{
            width: '100%',
            height: '200px',
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
