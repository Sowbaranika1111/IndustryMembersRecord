import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Add from './pages/Add';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './app.css';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  console.log("AppRoutes user:", user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:enterpriseId"
        element={
          <ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}>
            <Add />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}