import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

// --- SVG Icons (Self-contained components) ---
const MenuIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const UserSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }
    setError("");
    try {
      const response = await axios.post(`${baseUrl}/api/users/signup`, {
        username,
        password,
      });
      if (response.data.message === "User created") {
        setSuccess(`User ${response.data.user.username} created successfully.`);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError("Signup failed");
        setSuccess("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error signing up");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-50 to-green-100">
      <Navbar />

      {/* Signup Form */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-full sm:max-w-md bg-white rounded-xl shadow-xl p-6 sm:p-10 ring-1 ring-gray-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-wide">
            User Signup
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-green-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-green-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-green-500 transition"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm font-medium">{success}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-green-600 hover:text-green-700 transition-colors"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserSignup;
