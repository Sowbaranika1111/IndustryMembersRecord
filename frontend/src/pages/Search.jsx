import React from 'react';

const cardStyle = {
  border: '1px solid #e0e0e0',
  padding: '16px',
  marginBottom: '16px',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
    <h3 style={{ margin: '0 0 8px', fontFamily: 'Segoe UI, sans-serif' }}>{name}</h3>
    <p style={{ margin: 0, color: '#555', fontFamily: 'Roboto, sans-serif' }}>{email}</p>
  </div>
);

export default function Search() {
  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <input
        type="text"
        placeholder="Search..."
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
      <ResultCard name="Alice Johnson" email="alice@example.com" />
      <ResultCard name="Bob Smith" email="bob@example.com" />
    </div>
  );
}
