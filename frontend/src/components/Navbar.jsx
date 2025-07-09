// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaPlusSquare, FaSignOutAlt, FaSearch, FaListAlt, FaFilter, FaUserSlash, FaTachometerAlt, FaBell } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const SidebarNav = ({ onLogout }) => (
  <aside className="ix-sidebar ix-sidebar-purple">
    <nav className="ix-sidebar-nav">
      <Link to="/home" className="ix-sidebar-link ix-sidebar-link-white">
        <FaHome className="ix-sidebar-icon" /> <span>Home</span>
      </Link>
      <Link to="/add" className="ix-sidebar-link ix-sidebar-link-white">
        <FaPlusSquare className="ix-sidebar-icon" /> <span>Add Form</span>
      </Link>
      <Link to="/lov" className="ix-sidebar-link ix-sidebar-link-white">
        <FaListAlt className="ix-sidebar-icon" /> <span>Update LOV values</span>
      </Link>
      <Link to="/advanced-filter" className="ix-sidebar-link ix-sidebar-link-white">
        <FaFilter className="ix-sidebar-icon" /> <span>Advanced filter</span>
      </Link>
      <Link to="/bulk-inactive" className="ix-sidebar-link ix-sidebar-link-white">
        <FaUserSlash className="ix-sidebar-icon" /> <span>Bulk Inactive user</span>
      </Link>
      <Link to="/dashboard" className="ix-sidebar-link ix-sidebar-link-white">
        <FaTachometerAlt className="ix-sidebar-icon" /> <span>Dashboard</span>
      </Link>
      <Link to="/notifications" className="ix-sidebar-link ix-sidebar-link-white">
        <FaBell className="ix-sidebar-icon" /> <span>Notification</span>
      </Link>
    </nav>
    <div className="ix-sidebar-spacer" />
    <button className="ix-sidebar-link ix-sidebar-link-white ix-sidebar-logout-bottom" onClick={onLogout}>
      <FaSignOutAlt className="ix-sidebar-icon" /> <span>Logout</span>
    </button>
  </aside>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      setError('');
      setLoading(false);
      return;
    }
    const fetchBatchmates = async () => {
      setLoading(true);
      setError('');
      setResults([]);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/batchmates/search?name=${encodeURIComponent(debouncedSearchTerm.trim())}`
        );
        setResults(response.data);
        setShowDropdown(true);
      } catch (err) {
        setResults([]);
        setShowDropdown(true);
        if (err.response && err.response.status === 404) {
          setError(`No batchmates found matching "${debouncedSearchTerm}".`);
        } else {
          setError('An error occurred while searching.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBatchmates();
  }, [debouncedSearchTerm]);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleResultClick = (emailAddress) => {
    setShowDropdown(false);
    setSearchTerm('');
    if (!emailAddress) return;
    const enterpriseId = emailAddress.split('@')[0];
    navigate(`/profile/${enterpriseId}`);
  };

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.ix-navbar-search')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <header className="ix-navbar">
        <div className="ix-navbar-left">
          <span className="ix-navbar-title">DU Skill Repository</span>
        </div>
        <div className="ix-navbar-center">
          <div className="ix-navbar-search">
            <FaSearch className="ix-navbar-search-icon" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchTerm && setShowDropdown(true)}
              className="ix-navbar-search-input"
              autoComplete="off"
            />
            {showDropdown && (searchTerm || loading || error) && (
              <div className="ix-navbar-search-dropdown">
                {loading && <div className="ix-navbar-search-loading">Loading...</div>}
                {error && <div className="ix-navbar-search-error">{error}</div>}
                {!loading && !error && results.length === 0 && (
                  <div className="ix-navbar-search-empty">No results</div>
                )}
                {!loading && !error && results.length > 0 && (
                  <ul className="ix-navbar-search-list">
                    {results.map((batchmate) => (
                      <li
                        key={batchmate._id}
                        className="ix-navbar-search-item"
                        onClick={() => handleResultClick(batchmate.email_address)}
                      >
                        <span className="ix-navbar-search-name">{batchmate.name}</span>
                        <span className="ix-navbar-search-email">{batchmate.email_address}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="ix-navbar-right">
          {user && (
            <span className="ix-navbar-user">{user.name || user.email_address}</span>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <SidebarNav onLogout={handleLogout} />

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="ix-modal-overlay">
          <div className="ix-modal">
            <div className="ix-modal-title">Confirm Logout</div>
            <div className="ix-modal-message">Are you sure you want to logout?</div>
            <div className="ix-modal-actions">
              <button className="ix-modal-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="ix-modal-logout" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
