import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [location, setLocation] = useState({ lat: '', lng: '', address: '', city: '', state: '' });
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: { format: 'jsonv2', lat, lon: lng },
        headers: { 'Accept-Language': 'en' },
      });
      if (response.status === 200 && response.data && response.data.address) {
        const addressObj = response.data.address;
        const city = addressObj.city || addressObj.town || addressObj.village || '';
        const state = addressObj.state || '';
        const address = response.data.display_name || '';
        setLocation(prev => ({
          ...prev,
          address,
          city,
          state,
        }));
      }
    } catch (error) {
      console.error('Error fetching address from Nominatim:', error);
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(prev => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: '',
            city: '',
            state: '',
          }));
          fetchAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setError('Location permission denied. Please allow location access.');
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setError('Location information is unavailable.');
          } else if (err.code === err.TIMEOUT) {
            setError('Location request timed out.');
          } else {
            setError('Failed to get location.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported');
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (photos.length > 0) {
      const newPreviews = photos.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [photos]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const totalSelected = photos.length + files.length;
    if (totalSelected > 10) {
      setError('You can only upload up to 10 images.');
      const allowedFiles = files.slice(0, 10 - photos.length);
      setPhotos(prev => [...prev, ...allowedFiles]);
    } else {
      setError('');
      setPhotos(prev => [...prev, ...files]);
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length < 1) {
      setError('Please upload at least one image.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess(false);

    const userId = localStorage.getItem('user_id');
    const data = new FormData();
    data.append('user_id', userId);
    data.append('issue_title', form.title);
    data.append('description', form.description);
    data.append('category', form.category);
    data.append('latitude', location.lat);
    data.append('longitude', location.lng);
    data.append('location', location.address);
    photos.forEach(img => data.append('images', img));

    try {
      await axios.post(`${baseUrl}/api/issues`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setForm({ title: '', description: '', category: '' });
      setPhotos([]);
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.data.message || 'Failed to submit issue'}`);
      } else {
        setError('Network error or server down');
      }
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 py-16 pt-20">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-600 mb-6">
            <svg className="mx-auto h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-green-800">Issue Submitted!</h2>
          <p className="mb-8 text-green-700">
            Your issue has been successfully submitted. Thank you for your feedback.
          </p>
          <button
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition"
            onClick={() => navigate('/landing')}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-50 to-green-100 pt-20 px-4 py-8 sm:py-12">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="flex-grow w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-10 mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-green-900 text-center">Create New Issue</h1>
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Capture or select photos (max 10):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handlePhotoChange}
              className="block w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            />
            <div className="flex flex-wrap gap-4 mt-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded overflow-hidden shadow-sm border border-gray-300">
                  <img src={src} alt={`Preview ${i + 1}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-red-600 rounded-full text-white w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 focus:outline-none"
                    aria-label={`Remove image ${i + 1}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Location:</label>
            <div className="text-gray-700">
              {location.address ? (
                <>
                  <div>{location.address}</div>
                  <div>
                    {location.city}
                    {location.state ? ', ' + location.state : ''}
                  </div>
                  <div className="text-sm text-gray-500">
                    Lat: {location.lat}, Lng: {location.lng}
                  </div>
                </>
              ) : (
                <div className="italic text-gray-400">Fetching location...</div>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Issue Title"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Issue Description"
              className="w-full border border-gray-300 px-4 py-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {(error) && (
            <p className="text-center font-medium text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || photos.length < 1}
            className={`w-full py-3 rounded font-semibold transition duration-200 ${
              submitting || photos.length < 1
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-4 focus:ring-green-400'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => (
  <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-sm z-50 w-full">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-extrabold text-green-700 tracking-wider">Pioneers</span>
      </div>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link to="/landing" className="text-green-700 hover:text-green-900 transition-colors">Home</Link>
      </nav>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-green-700 focus:outline-none">
          {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
    </div>
    {/* Mobile Navigation Menu */}
    {isMenuOpen && (
      <div className="md:hidden bg-white border-t">
        <nav className="flex flex-col items-center space-y-4 py-4">
          <Link to="/landing" onClick={() => setIsMenuOpen(false)} className="text-green-700 hover:text-green-900 transition-colors">Landing Page</Link>
        </nav>
      </div>
    )}
  </header>
);

export default Home;
