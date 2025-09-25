import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

// --- Loading Skeleton Component ---
const IssueCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-5 bg-gray-200 rounded-full w-24"></div>
      <div className="h-5 bg-gray-200 rounded-full w-20"></div>
    </div>
    <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-6"></div>
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded-full w-28"></div>
      <div className="h-6 bg-gray-200 rounded-md w-24"></div>
    </div>
  </div>
);

// --- Helper Component for Status Badges ---
const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : 'unknown';
  let colorClasses = '';

  switch (normalizedStatus) {
    case 'open': 
      colorClasses = 'bg-green-100 text-green-800'; 
      break;
    case 'in progress': 
      colorClasses = 'bg-yellow-100 text-yellow-800'; 
      break;
    case 'closed': 
      colorClasses = 'bg-red-100 text-red-800'; 
      break;
    default: 
      colorClasses = 'bg-gray-100 text-gray-800';
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClasses}`}>
      <span className={`w-2 h-2 mr-2 rounded-full ${colorClasses.replace('text', 'bg').replace('100', '500')}`}></span>
      {status || 'N/A'}
    </div>
  );
};

// --- Main Issue List Component ---
const IssueList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/issues`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setIssues(data.issues || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [baseUrl]);
  
  // UPDATED: Accepts the event object 'e' to stop propagation
  const handleUpvoteToggle = async (e, issueId) => {
    e.stopPropagation(); // This is crucial to prevent navigation when upvoting

    if (!currentUserId) {
      alert("You must be logged in to upvote.");
      return;
    }

    const originalIssues = [...issues];
    const issueToUpdate = issues.find(issue => issue.id === issueId);
    if (!issueToUpdate) return;
    
    const hasUpvoted = issueToUpdate.upvotes.users.includes(currentUserId);

    const updatedIssues = issues.map(issue => {
      if (issue.id === issueId) {
        const newCount = hasUpvoted ? issue.upvotes.count - 1 : issue.upvotes.count + 1;
        const newUsers = hasUpvoted
          ? issueToUpdate.upvotes.users.filter(id => id !== currentUserId)
          : [...issueToUpdate.upvotes.users, currentUserId];
        return { ...issue, upvotes: { count: newCount, users: newUsers } };
      }
      return issue;
    });
    setIssues(updatedIssues);

    const url = `${baseUrl}/api/issues/${issueId}/upvote`;
    const payload = { user_id: currentUserId };

    try {
      if (hasUpvoted) {
        await axios.delete(url, { data: payload });
      } else {
        await axios.post(url, payload);
      }
    } catch (err) {
      console.error("Upvote failed:", err);
      setIssues(originalIssues);
      alert("Failed to update upvote. Please try again.");
    }
  };
  
  const handleViewDetails = (issueId) => {
    navigate('/issue-detail', { state: { issueId: issueId } });
  };

  const renderContent = () => {
    if (loading) {
      return (
        Array.from({ length: 6 }).map((_, index) => <IssueCardSkeleton key={index} />)
      );
    }

    if (error) {
      return (
        <div className="col-span-full text-center p-12 bg-red-50 rounded-lg">
          <h3 className="text-xl font-semibold text-red-700">Oops! Something went wrong.</h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      );
    }
    
    if (issues.length === 0) {
      return (
        <div className="col-span-full text-center p-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700">No Issues Found</h3>
          <p className="text-gray-500 mt-2">It looks like the issue tracker is all clear!</p>
        </div>
      );
    }

    return (
      issues.map((issue) => {
        const hasUserUpvoted = currentUserId ? issue.upvotes.users.includes(currentUserId) : false;
        
        return (
          // UPDATED: onClick is on the main card div
          <div 
            key={issue.id} 
            className="group bg-white rounded-xl p-6 shadow-md border border-gray-200 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            onClick={() => handleViewDetails(issue.id)}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{issue.category}</span>
                <StatusBadge status={issue.status} />
              </div>
              <h2 className="text-lg font-bold text-gray-800 leading-tight pointer-events-none">{issue.issue_title}</h2>
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200 z-10 ${
                  hasUserUpvoted 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                // UPDATED: Pass the event object to stop propagation
                onClick={(e) => handleUpvoteToggle(e, issue.id)}
              >
                👍 <span>{issue.upvotes.count}</span>
              </button>
              {/* UPDATED: This button is now just a visual cue. The group-hover makes it react to the card hover. */}
              <div
                className="text-sm font-semibold text-gray-500 group-hover:text-indigo-600 transition-colors duration-200"
              >
                View Details →
              </div>
            </div>
          </div>
        );
      })
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Active Issues</h1>
          <p className="mt-4 text-xl text-gray-600">A summary of all reported issues.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default IssueList;