import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

// --- Helper Component for Status Badges ---
const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : 'unknown';
  let statusClass = 'status-badge ';

  switch (normalizedStatus) {
    case 'open': statusClass += 'status-open'; break;
    case 'in progress': statusClass += 'status-in-progress'; break;
    case 'closed': statusClass += 'status-closed'; break;
    default: statusClass += 'status-unknown';
  }

  return (
    <div className={statusClass}>
      <span className="status-dot"></span>
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

  const handleUpvoteToggle = async (issueId) => {
    if (!currentUserId) {
      alert("You must be logged in to upvote.");
      return;
    }

    const originalIssues = [...issues];
    const issueToUpdate = issues.find(issue => issue.id === issueId);
    if (!issueToUpdate) return;
    
    const hasUpvoted = issueToUpdate.upvotes.users.includes(currentUserId);

    // Optimistic UI Update
    const updatedIssues = issues.map(issue => {
      if (issue.id === issueId) {
        const newCount = hasUpvoted ? issue.upvotes.count - 1 : issue.upvotes.count + 1;
        const newUsers = hasUpvoted
          ? issue.upvotes.users.filter(id => id !== currentUserId)
          : [...issue.upvotes.users, currentUserId];
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
  
  // UPDATED: Navigation now passes ID via router state
  const handleViewDetails = (issueId) => {
    navigate('/issue-detail', { state: { issueId: issueId } });
  };

  const renderLoading = () => <div className="status-container"><div className="loader"></div><p>Fetching Issues...</p></div>;
  const renderError = () => <div className="status-container error"><h3>Oops! Something went wrong.</h3><p>{error}</p></div>;
  const renderNoIssues = () => <div className="status-container"><h3>No Issues Found</h3><p>It looks like the issue tracker is all clear!</p></div>;

  const renderIssueGrid = () => (
    <div className="issue-grid">
      {issues.map((issue) => {
        const hasUserUpvoted = currentUserId ? issue.upvotes.users.includes(currentUserId) : false;
        
        return (
          <div key={issue.id} className="issue-card">
            <div>
              <div className="card-header">
                <span className="issue-category">{issue.category}</span>
                <StatusBadge status={issue.status} />
              </div>
              <h2 className="issue-title">{issue.issue_title}</h2>
            </div>
            <div className="card-footer">
              <button
                className={`upvote-btn ${hasUserUpvoted ? 'active' : ''}`}
                onClick={() => handleUpvoteToggle(issue.id)}
              >
                👍 {issue.upvotes.count}
              </button>
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(issue.id)}
              >
                View Details →
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
    <Navbar />
      <ComponentStyles />
      <div className="issue-list-container">
        <header className="main-header">
          <h1>Active Issues</h1>
          <p>A summary of all reported issues.</p>
        </header>
        <main>
          {loading ? renderLoading() : 
           error ? renderError() : 
           issues.length > 0 ? renderIssueGrid() :
           renderNoIssues()}
        </main>
      </div>
    </>
  );
};

// --- Scoped CSS for the Component ---
const ComponentStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    :root {
      --font-primary: 'Poppins', sans-serif;
      --bg-color: #f4f7fe;
      --card-bg: #ffffff;
      --text-dark: #1e293b;
      --text-light: #64748b;
      --accent-color: #4f46e5;
      --border-color: #e2e8f0;
      --shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05);
      --green: #10b981;
      --orange: #f59e0b;
      --red: #ef4444;
      --gray: #6b7280;
    }
    .issue-list-container { font-family: var(--font-primary); background-color: var(--bg-color); min-height: 100vh; padding: 1rem 1.5rem; }
    .main-header { text-align: center; margin-bottom: 3rem; }
    .main-header h1 { font-size: 2.5rem; font-weight: 700; color: var(--text-dark); margin: 0; }
    .main-header p { font-size: 1.1rem; color: var(--text-light); margin-top: 0.5rem; }
    .issue-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; max-width: 1200px; margin: 0 auto; }
    .issue-card { background: var(--card-bg); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow); transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; display: flex; flex-direction: column; justify-content: space-between; }
    .issue-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.07), 0 10px 10px -5px rgba(0,0,0,0.04); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .issue-category { font-size: 0.8rem; font-weight: 500; color: var(--accent-color); background-color: #eef2ff; padding: 0.25rem 0.75rem; border-radius: 99px; }
    .issue-title { font-size: 1.25rem; font-weight: 600; color: var(--text-dark); margin: 0; line-height: 1.4; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; }
    .upvote-btn { display: inline-flex; align-items: center; gap: 0.5rem; font-family: var(--font-primary); font-weight: 600; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 99px; cursor: pointer; transition: all 0.2s ease; border: 1px solid var(--border-color); background-color: #f8fafc; color: var(--text-light); }
    .upvote-btn:hover { background-color: #f1f5f9; border-color: #cbd5e1; }
    .upvote-btn.active { background-color: var(--accent-color); border-color: var(--accent-color); color: #fff; }
    .upvote-btn.active:hover { background-color: #4338ca; }
    .view-details-btn { font-family: var(--font-primary); font-weight: 500; color: var(--text-light); background: none; border: none; padding: 0.5rem; cursor: pointer; transition: color 0.2s ease; }
    .view-details-btn:hover { color: var(--accent-color); }
    .status-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.8rem; font-weight: 500; text-transform: capitalize; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .status-open { background-color: #d1fae5; color: #065f46; }
    .status-open .status-dot { background-color: var(--green); }
    .status-in-progress { background-color: #fef3c7; color: #92400e; }
    .status-in-progress .status-dot { background-color: var(--orange); }
    .status-closed { background-color: #fee2e2; color: #991b1b; }
    .status-closed .status-dot { background-color: var(--red); }
    .status-unknown { background-color: #f3f4f6; color: #4b5563; }
    .status-unknown .status-dot { background-color: var(--gray); }
    .status-container { text-align: center; padding: 4rem 1rem; color: var(--text-light); }
    .status-container.error h3 { color: var(--red); }
    .loader { width: 48px; height: 48px; border: 5px solid var(--accent-color); border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite; margin-bottom: 1rem; }
    @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `}</style>
);

export default IssueList;