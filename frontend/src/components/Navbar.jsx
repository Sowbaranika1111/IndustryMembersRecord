// Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogout = async () => {
    setShowLogoutModal(true);
  };
  
  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/');
  };
  
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
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '32px 28px',
            borderRadius: '10px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            minWidth: '320px',
            textAlign: 'center',
            fontFamily: 'Segoe UI, sans-serif'
          }}>
            <div style={{ fontSize: '22px', fontWeight: 600, marginBottom: '12px', color: '#A100FF' }}>Confirm Logout</div>
            <div style={{ fontSize: '16px', marginBottom: '28px', color: '#333' }}>
              Are you sure you want to logout?
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '18px' }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  padding: '8px 22px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'background 0.2s',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '8px 22px',
                  background: '#A100FF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'background 0.2s',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Industry X Members</Link>
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/search" style={{ color: 'white', textDecoration: 'none' }}>Search</Link>
        <Link to="/add" style={{ color: 'white', textDecoration: 'none' }}>Add</Link>
        {user && (
          <>
            <span style={{ color: 'white', fontSize: '14px' }}>
              Welcome, {user.name || user.email_address}
            </span>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: '15px',
                background: 'white',
                color: '#A100FF',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f3e6ff';
                e.currentTarget.style.color = '#6a0dad';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#A100FF';
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
