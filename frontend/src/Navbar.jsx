import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- SVG Icons (for bottom navbar) ---
const HomeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l9 8h-5v8h-8v-8H3l9-8z"></path>
  </svg>
);

const ListIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M3 12h18M3 18h18"></path>
  </svg>
);

const ReportIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2h12c1.1 0 1.99-.9 1.99-2V8l-6-6z"></path>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6z"></path>
  </svg>
);

// --- Navbar Component ---
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-6 py-2 flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-green-700 transition-colors">
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/issuelist" className="flex flex-col items-center text-gray-600 hover:text-green-700 transition-colors">
          <ListIcon className="h-6 w-6" />
          <span className="text-xs">Issue List</span>
        </Link>
        <Link to="/home" className="flex flex-col items-center text-gray-600 hover:text-green-700 transition-colors">
          <ReportIcon className="h-6 w-6" />
          <span className="text-xs">Report</span>
        </Link>

        {/* Display Profile link only if logged in */}
        {isLoggedIn && (
          <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-green-700 transition-colors">
            <UserIcon className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </Link>
        )}

        {/* Display Login link or Logout button */}
        {!isLoggedIn ? (
          <Link to="/login" className="text-gray-600 hover:text-green-700 transition-colors font-semibold">
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 hover:shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Logout
          </button>
        )}
      </div>
    </footer>
  );
};

export default Navbar;
