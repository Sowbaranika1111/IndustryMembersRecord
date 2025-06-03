import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddBatchmate from './components/AddBatchmate';
import EditBatchmate from './components/EditBatchmate';
import SearchBatchmate from './components/SearchBatchmate';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/add">Add</Link> |{' '}
          <Link to="/search">Search</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddBatchmate />} />
          <Route path="/edit/:id" element={<EditBatchmate />} />
          <Route path="/search" element={<SearchBatchmate />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;