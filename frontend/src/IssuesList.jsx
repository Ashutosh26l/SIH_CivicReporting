import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('admin');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:3000/api/issues');
        setIssues(response.data.issues || []);
      } catch {
        setError('Failed to fetch issues');
      }
      setLoading(false);
    };
    fetchIssues();
  }, []);

  const openIssueDetails = (issue) => {
    setSelectedIssue(issue);
    if (issue.images && issue.images.length > 0) {
      setMainImage(issue.images[0]);
    } else {
      setMainImage(null);
    }
  };

  const closeIssueDetails = () => {
    setSelectedIssue(null);
    setMainImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-green-200 to-purple-200">
        <div className="text-gray-700 font-semibold">Loading issues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-200 to-yellow-200">
        <div className="text-red-700 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <h1 className="text-5xl font-extrabold text-center mb-10 text-purple-900">Issues List</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {issues.map(issue => (
          <div
            key={issue.id}
            onClick={() => openIssueDetails(issue)}
            className="cursor-pointer rounded-2xl p-6 bg-white shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-transparent hover:border-indigo-400"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && openIssueDetails(issue)}
          >
            <h2 className="text-xl font-semibold mb-1 text-indigo-900">{issue.issue_title}</h2>
            <p className="text-gray-700 mb-2 truncate">{issue.description}</p>
            <p className="text-indigo-700 font-medium text-sm mb-2">Category: {issue.category}</p>
            <p className="text-indigo-900 font-semibold">
              Upvotes: {issue.upvotes?.count || 0}
            </p>
            <p className="text-gray-500 text-xs mt-3">Created: {new Date(issue.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {selectedIssue && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gradient-to-br from-white to-purple-100 flex items-start justify-center p-6 sm:p-12">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-8 sm:p-12 overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeIssueDetails}
              aria-label="Close details"
              className="absolute top-6 right-6 text-purple-900 hover:text-purple-700 focus:outline-none cursor-pointer text-3xl font-extrabold select-none"
              type="button"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-6 text-indigo-900">{selectedIssue.issue_title}</h2>
            <p className="mb-4 text-gray-800 text-lg">{selectedIssue.description}</p>

            <div className="flex flex-wrap gap-6 mb-6">
              <div><strong>Category:</strong> {selectedIssue.category}</div>
              <div><strong>Location:</strong> {selectedIssue.location}</div>
              <div><strong>Latitude:</strong> {selectedIssue.latitude}</div>
              <div><strong>Longitude:</strong> {selectedIssue.longitude}</div>
              <div><strong>Status:</strong> {selectedIssue.status}</div>
              <div><strong>Assigned Official:</strong> {selectedIssue.assigned_official || 'None'}</div>
              <div><strong>Upvotes:</strong> {selectedIssue.upvotes?.count || 0}</div>
              <div><strong>Submitted:</strong> {new Date(selectedIssue.created_at).toLocaleString()}</div>
            </div>

            {selectedIssue.images.length > 0 ? (
              <>
                <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-indigo-300 max-h-[400px]">
                  <img
                    src={mainImage}
                    alt="Issue main"
                    className="object-contain w-full max-h-[400px]"
                  />
                </div>
                {selectedIssue.images.length > 1 && (
                  <div className="flex space-x-4 overflow-x-auto">
                    {selectedIssue.images.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg border-4 transition-shadow duration-200 ${
                          mainImage === img ? 'border-indigo-600 shadow-lg' : 'border-transparent'
                        }`}
                        onClick={() => setMainImage(img)}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="italic text-gray-600">No images available for this issue.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuesList;
