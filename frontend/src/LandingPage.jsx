import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

// --- SVG Icons (Self-contained components) ---
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

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 mb-4 text-green-600">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
    <circle cx="12" cy="13" r="3"></circle>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 mb-4 text-green-600">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 mb-4 text-green-600">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// --- Main App Component ---
export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const issues = [
    { id: 1, category: 'Waste Management', location: 'Ranchi', status: 'Resolved', imageUrl: 'https://placehold.co/600x400/c7e8ca/4d594f?text=Garbage+Cleared' },
    { id: 2, category: 'Pothole', location: 'Jamshedpur', status: 'In Progress', imageUrl: 'https://placehold.co/600x400/fff3cd/4d594f?text=Road+Repair' },
    { id: 3, category: 'Street Light', location: 'Dhanbad', status: 'New', imageUrl: 'https://placehold.co/600x400/f8d7da/4d594f?text=Light+Outage' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'New': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">

      <main>
        {/* --- Hero Section --- */}
        <section
          className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white px-6 bg-[#2c3e50]"
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight">Report. Track. Resolve.</h1>
            <p className="text-lg md:text-xl mb-8 font-light text-gray-200">
              Your voice for a better Jharkhand. Report civic issues in your area and help build a cleaner, safer community together.
            </p>
            <Link
              to="/home"
              className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 text-lg rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-110 shadow-xl"
            >
              Report an Issue Now
            </Link>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">A Simple 3-Step Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">Making a difference has never been easier. Follow these simple steps to get started.</p>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <CameraIcon />
                <h3 className="text-xl font-semibold mb-2">1. Snap & Describe</h3>
                <p className="text-gray-600">Take a photo of the issue and provide a brief description along with the location.</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <SendIcon />
                <h3 className="text-xl font-semibold mb-2">2. Submit Your Report</h3>
                <p className="text-gray-600">Submit your report through our easy-to-use portal. You'll receive a unique tracking ID.</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <CheckCircleIcon />
                <h3 className="text-xl font-semibold mb-2">3. See It Resolved</h3>
                <p className="text-gray-600">Track the status of your report in real-time and get notified upon resolution.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Navbar />
    </div>
  );
}