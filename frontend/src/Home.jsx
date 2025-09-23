import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [location, setLocation] = useState({
    lat: '',
    lng: '',
    address: '',
    city: '',
    state: '',
  });
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
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
    setSuccess('');

    // Get the user_id from localStorage
    const userId = localStorage.getItem('user_id');
    const data = new FormData();
    data.append('user_id', userId); // Add the user_id to the form data
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
      setSuccess('Issue submitted successfully');
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

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">Create New Issue</h1>
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Capture or select photos (max 10):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handlePhotoChange}
              className="block w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
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
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Issue Description"
              className="w-full border border-gray-300 px-4 py-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {(error || success) && (
            <p className={`text-center font-medium ${error ? 'text-red-600' : 'text-green-600'}`}>
              {error || success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || photos.length < 1}
            className={`w-full py-3 rounded font-semibold transition duration-200 ${
              submitting || photos.length < 1
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-4 focus:ring-blue-400'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
