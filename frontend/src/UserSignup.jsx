// UserSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UserSignup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      return;
    }
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/users/signup', {
        username,
        password,
      });
      if (response.data.message === 'User created') {
        setSuccess(`User ${response.data.user.username} created successfully.`);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Signup failed');
        setSuccess('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error signing up');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-10 ring-1 ring-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-wide">
          User Signup
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
              placeholder="Choose a username"
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-green-500 transition"
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
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-green-500 transition"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-green-500 transition"
            />
          </div>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
