import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import Navbar from './Navbar';

const UserLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-50 to-green-100">
      <Navbar />
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 text-white rounded-lg shadow-md focus:outline-none focus:ring-4 transition ${
                loading 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-300'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>
          
          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-green-600 hover:text-green-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserLogin;