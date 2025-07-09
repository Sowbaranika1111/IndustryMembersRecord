import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Add from './pages/Add';
import Login from './pages/Login';
import EditUser from './pages/EditUser';
import EditAdmin from './pages/EditAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './app.css';
import Lov from './pages/Lov';
import AdvancedFilter from './pages/AdvancedFilter';
import BulkInactive from './pages/BulkInactive';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';

const AppLayout = ({ children }) => {
  return (
    <div className="ix-layout">
      {/* Navbar includes both top and left navbars */}
      <Navbar />
      <main className="ix-main-content">{children}</main>
    </div>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  if (loading) {
    return <div>Loading...</div>;
  }

  // Only wrap in layout if not login page, user is logged in, and user is admin
  if (!isLoginPage && user && user.role === 'admin') {
    return (
      <AppLayout>
        <Routes>
          <Route path="/home" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Home /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Add /></ProtectedRoute>} />
          <Route path="/lov" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Lov /></ProtectedRoute>} />
          <Route path="/advanced-filter" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><AdvancedFilter /></ProtectedRoute>} />
          <Route path="/bulk-inactive" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><BulkInactive /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Dashboard /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Notifications /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Search /></ProtectedRoute>} />
          <Route path="/profile/:enterpriseId" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Profile /></ProtectedRoute>} />
          <Route path="/edit-user/:emailId" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><EditUser /></ProtectedRoute>} />
          <Route path="/edit-admin/:emailId" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><EditAdmin /></ProtectedRoute>} />
        </Routes>
      </AppLayout>
    );
  }

  // For non-admin users (or login page), render content without navbars/layout
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Home /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Search /></ProtectedRoute>} />
      <Route path="/profile/:enterpriseId" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Profile /></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><Add /></ProtectedRoute>} />
      <Route path="/edit-user/:emailId" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><EditUser /></ProtectedRoute>} />
      <Route path="/edit-admin/:emailId" element={<ProtectedRoute userRole={user?.role} userEnterpriseId={user?.enterpriseId}><EditAdmin /></ProtectedRoute>} />
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