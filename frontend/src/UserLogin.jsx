import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// --- SVG Icons ---
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

const UserLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${baseUrl}/api/users/login`, { username, password });
      if (response.data.token) {
        localStorage.setItem('user', response.data.token);
        localStorage.setItem('user_id', response.data.user.id);
        setUsername('');
        setPassword('');
        onLoginSuccess && onLoginSuccess(response.data.token);
        navigate('/home');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-50 to-green-100">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-extrabold text-green-700 tracking-wider">Pioneers</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-700 transition-colors">Home</Link>
            <Link to="/signup" className="text-gray-600 hover:text-green-700 transition-colors">SignUp</Link>
            <Link to="/login" className="text-gray-600 hover:text-green-700 transition-colors font-semibold">Login</Link>
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
              <Link to="/landing" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-green-700 transition-colors">Home</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-green-700 transition-colors">SignUp</Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-green-700 transition-colors font-semibold">Login</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Login Form */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 sm:p-10 ring-1 ring-gray-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8 text-center tracking-wide">
            User Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-green-500 transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-green-500 transition"
              />
            </div>
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserLogin;
