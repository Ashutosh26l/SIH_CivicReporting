import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const UserLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
