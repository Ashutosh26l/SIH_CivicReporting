import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        username,
        password,
      });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-10 ring-1 ring-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-wide">
          User Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-7">
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
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-500 transition"
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
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-500 transition"
            />
          </div>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
