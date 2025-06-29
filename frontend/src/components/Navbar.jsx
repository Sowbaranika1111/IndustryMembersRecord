// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <nav style={{ 
      padding: '10px 20px', 
      height: '40px', 
      backgroundColor: '#A100FF', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      fontFamily: '"Segoe UI", sans-serif'
    }}>
      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Industry X Members</Link>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/search" style={{ color: 'white', textDecoration: 'none' }}>Search</Link>
        <Link to="/add" style={{ color: 'white', textDecoration: 'none' }}>Add</Link>
        {user && (
          <span style={{ color: 'white', fontSize: '14px' }}>
            Welcome, {user.name || user.email_address}
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
