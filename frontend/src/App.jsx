import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Add from './pages/Add';
import Login from './pages/Login';
import './app.css';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:batchmateId" element={<Profile />} /> 
        <Route path="/add" element={<Add />} />
        <Route path="/" element={< Login/>} />
      </Routes>
    </Router>
  );
}