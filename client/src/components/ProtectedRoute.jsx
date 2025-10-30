import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please sign in to access this page.");
      // Redirect to home and open login modal, passing current path as 'next'
      navigate(`/?login=1&next=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [currentUser, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary-500 rounded-full animate-bounce"></div>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Loading...</h3>
          <p className="text-neutral-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return currentUser ? children : null;
};

export default ProtectedRoute;


