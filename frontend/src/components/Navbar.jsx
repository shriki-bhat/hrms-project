// frontend/src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-black border-b border-amber-600/10 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Premium Logo */}
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => navigate('/employees')}>
            <img 
              src="/logo.png" 
              alt="HRMS Connect" 
              className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            {isAuth && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm uppercase tracking-wider ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-black'
                        : 'text-gray-300 hover:text-amber-400'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/employees"
                  className={({ isActive }) =>
                    `px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm uppercase tracking-wider ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-black'
                        : 'text-gray-300 hover:text-amber-400'
                    }`
                  }
                >
                  Employees
                </NavLink>
                <NavLink
                  to="/teams"
                  className={({ isActive }) =>
                    `px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm uppercase tracking-wider ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-black'
                        : 'text-gray-300 hover:text-amber-400'
                    }`
                  }
                >
                  Teams
                </NavLink>
              </>
            )}
            {!isAuth ? (
              <>
                <NavLink
                  to="/login"
                  className="text-gray-300 hover:text-amber-400 px-6 py-2.5 rounded-lg transition font-semibold text-sm uppercase tracking-wider"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black px-6 py-2.5 rounded-lg font-bold transition text-sm uppercase tracking-wider"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-900 hover:bg-red-800 text-white px-6 py-2.5 rounded-lg font-semibold transition ml-2 text-sm uppercase tracking-wider"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
