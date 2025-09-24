import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MenuIcon = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-extrabold text-green-700 tracking-wider">Pioneers</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-green-700 transition-colors">Home</Link>
          <Link to="/issuelist" className="text-gray-600 hover:text-green-700 transition-colors">Issue List</Link>
          <Link to="/home" className="text-gray-600 hover:text-green-700 transition-colors">Report An Issue</Link>

          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="text-gray-600 hover:text-green-700 transition-colors">SignUp</Link>
              <Link to="/login" className="text-gray-600 hover:text-green-700 transition-colors font-semibold">Login</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 hover:shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 focus:outline-none">
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-green-700 transition-colors">Home</Link>
            <Link to="/issuelist" className="text-gray-600 hover:text-green-700 transition-colors">Issue List</Link>
            <Link to="/home" className="text-gray-600 hover:text-green-700 transition-colors">Report An Issue</Link>

            {!isLoggedIn ? (
              <>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-green-700 transition-colors">SignUp</Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-green-700 transition-colors font-semibold">Login</Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 hover:shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
