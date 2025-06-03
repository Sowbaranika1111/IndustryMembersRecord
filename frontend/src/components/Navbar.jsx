// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
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
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Industry X Members</Link>
        </div>
        <div>
            <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Home</Link>
            <Link to="/add" style={{ color: 'white', textDecoration: 'none' }}>Add</Link>
        </div>
    </nav>
);

export default Navbar;
