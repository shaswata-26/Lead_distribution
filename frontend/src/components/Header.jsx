import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Lead Distribution System 1
            </h1>
            
            {/* REPLACE THIS NAVIGATION SECTION */}
            <nav className="flex space-x-4">
              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/agents')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/agents')
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Agents
                  </button>
                </>
              )}
              {user?.role === 'agent' && (
                <button
                  onClick={() => navigate('/agent-dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/agent-dashboard')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Tasks
                </button>
              )}
            </nav>
            {/* END OF REPLACED SECTION */}
            
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;