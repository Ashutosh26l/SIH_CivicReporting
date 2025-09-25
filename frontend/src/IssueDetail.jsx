import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

// --- Loading Animation Component ---
const CenteredLoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700">
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse"></div>
    </div>
    <p className="mt-4 text-lg font-medium">Loading Issue Details...</p>
  </div>
);

// --- Helper Components & Icons ---
const StatusBadge = ({ status }) => {
  const isOpen = status ? status.toLowerCase() === 'open' : false;
  const statusClasses = isOpen
    ? 'text-green-700 bg-green-100 border-green-400'
    : 'text-red-700 bg-red-100 border-red-400';
  return (
    <span
      className={`px-3 py-1 rounded-full font-bold text-xs tracking-wider leading-tight border ${statusClasses}`}
    >
      {status ? status.toUpperCase() : 'UNKNOWN'}
    </span>
  );
};
const UpvoteIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v4h-2a2 2 0 0 0 -2 2h-4a2 2 0 0 0 -2 -2h-2a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z"></path></svg>
);
const LocationIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mr-2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mr-2"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>;
const CategoryIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mr-2"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>;
const CommentsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>;

const IssueDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const issueId = location.state?.issueId;

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const currentUserId = localStorage.getItem('user_id');

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [mainImage, setMainImage] = useState('');
  
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    if (!issueId) {
      setLoading(false);
      setError("No issue selected. Please return to the list.");
      return;
    }
    const fetchIssueData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/issues/${issueId}`);
        const fetchedIssue = response.data.issue;
        setIssue(fetchedIssue);
        setUpvoteCount(fetchedIssue.upvotes?.count ?? 0);
        if (currentUserId) {
            setHasUpvoted(fetchedIssue.upvotes?.users?.includes(currentUserId) ?? false);
        }
        if (fetchedIssue.images && fetchedIssue.images.length > 0) {
            setMainImage(fetchedIssue.images[0]);
        }
        setComments(fetchedIssue.comments ?? []);
      } catch (err) {
        setError(err.message || "Failed to fetch issue data.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssueData();
  }, [issueId, baseUrl, currentUserId]);

  const handleUpvoteClick = async () => {
    if (!currentUserId) {
      alert("Please log in to upvote.");
      return;
    }
    if (!issue) return;
    const originalUpvotedState = hasUpvoted;
    const originalCount = upvoteCount;
    setHasUpvoted(!originalUpvotedState);
    setUpvoteCount(originalUpvotedState ? originalCount - 1 : originalCount + 1);
    const url = `${baseUrl}/api/issues/${issue.id}/upvote`;
    const payload = { user_id: currentUserId };
    try {
      const method = originalUpvotedState ? 'DELETE' : 'POST';
      const response = await axios({ method, url, data: payload });
      if (response.data && typeof response.data.count === 'number') {
        setUpvoteCount(response.data.count);
      }
    } catch (err) {
      console.error("Upvote failed:", err);
      setHasUpvoted(originalUpvotedState);
      setUpvoteCount(originalCount);
      alert("Something went wrong with your upvote. Please try again.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!currentUserId) {
      alert("You must be logged in to comment.");
      return;
    }
    const newCommentObject = {
        id: `temp-${Date.now()}`,
        user_id: currentUserId,
        comment: newComment,
        created_at: new Date().toISOString(),
    };
    const previousComments = comments;
    setComments([...comments, newCommentObject]);
    setNewComment('');
    try {
        await axios.post(`${baseUrl}/api/issues/${issueId}/comments`, {
            user_id: currentUserId,
            comment: newComment
        });
    } catch (err) {
        console.error("Failed to post comment:", err);
        setComments(previousComments);
        alert("Failed to post comment. Please try again.");
    }
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const formatCommentTimestamp = (dateString) => new Date(dateString).toLocaleString(undefined, {
    dateStyle: 'medium', timeStyle: 'short'
  });

  if (loading) return <CenteredLoadingAnimation />;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-red-600">
      <h3 className="text-2xl font-semibold mb-4">Error</h3>
      <p className="text-lg mb-6">{error}</p>
      <Link to="/issues" className="text-blue-600 hover:text-blue-800 text-lg font-medium transition-colors duration-200">← Go back to Issues List</Link>
    </div>
  );
  if (!issue) return <div className="flex items-center justify-center h-screen text-gray-600"><h3>Issue Not Found</h3></div>;

  return (
    <>
      <Navbar />
      <div className="font-sans bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* NEW: Back Button */}
          <button 
            onClick={() => navigate('/issueList')} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold mb-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Issues
          </button>

          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl border border-gray-200">
            {/* UPDATED: Header Layout */}
            <header className="mb-8 pb-6 border-b border-dashed border-gray-200">
              <div className="flex justify-between items-start text-sm text-gray-600 mb-4">
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                  <CategoryIcon /> Category: <strong className="ml-2 font-medium">{issue.category}</strong>
                </div>
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                  <CalendarIcon /> Reported on {formatDate(issue.created_at)}
                </div>
              </div>
              <div className="text-center">
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                  {issue.issue_title}
                </h1>
                <StatusBadge status={issue.status} />
              </div>
            </header>

            {/* UPDATED: Centered Location */}
            <section className="flex justify-center mb-8 text-gray-600 text-sm">
              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                <LocationIcon /> {issue.location}
              </div>
            </section>

            <p className="text-lg leading-relaxed text-gray-800 mb-8">{issue.description}</p>
            
            {issue.images && issue.images.length > 0 && (
              <div className="mb-6">
                <div className="rounded-xl overflow-hidden mb-4 shadow-lg bg-white p-2 border border-gray-200">
                  <img src={mainImage} alt="Main Issue View" className="w-full h-96 object-contain rounded-lg" />
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {issue.images.map((img, index) => (
                    <div 
                      key={index} 
                      className={`w-24 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 shadow-sm bg-white 
                                ${img === mainImage ? 'border-pink-500 shadow-md transform -translate-y-1' : 'border-transparent hover:border-blue-400 hover:shadow-md'}`} 
                      onClick={() => setMainImage(img)}
                    >
                      <img src={img} alt={`Issue thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center mt-6">
              <button 
                className={`flex items-center gap-3 font-semibold px-5 py-2 rounded-full transition-all duration-200 border-2 
                          ${hasUpvoted ? 'bg-blue-600 border-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105' : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-md'}`} 
                onClick={handleUpvoteClick}
              >
                <UpvoteIcon filled={hasUpvoted} />
                <span>{upvoteCount} Upvote{upvoteCount !== 1 ? 's' : ''}</span>
              </button>
            </div>
            
            <hr className="border-t border-dashed border-gray-200 my-6" />

            <section>
              <button 
                className="flex items-center justify-center gap-3 w-full py-3 px-5 text-lg font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer transition-all duration-200 text-left hover:bg-white hover:border-blue-400 hover:text-blue-600 hover:shadow-md" 
                onClick={() => setIsCommentsVisible(!isCommentsVisible)}
              >
                <CommentsIcon />
                <span>{isCommentsVisible ? 'Hide' : 'Show'} Comments ({comments.length})</span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-700 ease-in-out ${isCommentsVisible ? 'max-h-[2000px] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'}`}
              >
                <div className="flex flex-col gap-6">
                  {comments.length > 0 ? comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm border-2 border-teal-600">
                        {comment.user_id ? comment.user_id.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="bg-white rounded-lg p-4 w-full border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <strong className="font-bold text-gray-900">
                            User {comment.user_id ? comment.user_id.substring(0, 8) + '...' : 'Unknown'}
                          </strong>
                          <span className="text-xs text-gray-500">
                            {formatCommentTimestamp(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base">{comment.comment}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 italic text-center p-4">Be the first to comment.</p>
                  )}
                </div>
                <form onSubmit={handleCommentSubmit} className="mt-8">
                  <textarea 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder="Join the conversation..." 
                    rows="4" 
                    className="w-full border border-gray-300 rounded-lg p-4 font-sans text-base resize-y focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                  />
                  <button 
                    type="submit" 
                    className="mt-4 px-7 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg cursor-pointer transition-all duration-200 hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Post Comment
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueDetail;