import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

// --- Helper Components & Icons ---
const StatusBadge = ({ status }) => {
  const isOpen = status ? status.toLowerCase() === 'open' : false;
  const style = {
    ...styles.badge,
    color: isOpen ? '#098551' : '#D92525',
    backgroundColor: isOpen ? 'rgba(56, 217, 169, 0.2)' : 'rgba(255, 137, 137, 0.2)',
    border: `1px solid ${isOpen ? 'rgba(56, 217, 169, 0.7)' : 'rgba(255, 137, 137, 0.7)'}`,
  };
  return <span style={style}>{status ? status.toUpperCase() : 'UNKNOWN'}</span>;
};
const UpvoteIcon = ({ filled }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v4h-2a2 2 0 0 0 -2 2h-4a2 2 0 0 0 -2 -2h-2a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z"></path></svg>
);
const LocationIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginRight: '8px' }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginRight: '8px' }}><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>;
const CategoryIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginRight: '8px' }}><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>;
const CommentsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>;

const IssueDetail = () => {
  const location = useLocation();
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
        const response = await fetch(`${baseUrl}/api/issues/${issueId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch issue data. Status: ${response.status}`);
        }
        const data = await response.json();
        
        // UPDATED: Access the issue object from the "issue" key
        const fetchedIssue = data.issue;
        setIssue(fetchedIssue);

        // Safely access nested properties and provide default values
        setUpvoteCount(fetchedIssue.upvotes?.count ?? 0);
        if (currentUserId) {
            setHasUpvoted(fetchedIssue.upvotes?.users?.includes(currentUserId) ?? false);
        }

        if (fetchedIssue.images && fetchedIssue.images.length > 0) {
            setMainImage(fetchedIssue.images[0]);
        }
        
        // NEW: Set comments from the API response, defaulting to an empty array
        setComments(fetchedIssue.comments ?? []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssueData();
  }, [issueId, baseUrl, currentUserId]);

  const handleUpvoteClick = async () => {
    // ... (upvote logic is unchanged)
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // This is an optimistic update. In a real app, you would also post to the server.
    const newCommentObject = {
        id: `temp-${Date.now()}`, // Temporary ID for the key
        author: 'You', // Or get the current user's name
        text: newComment,
        avatar: 'https://i.pravatar.cc/150?u=you' // Placeholder avatar
    };

    setComments([...comments, newCommentObject]);
    setNewComment('');

    // Example of how you would post the comment to the server
    /*
    try {
        await axios.post(`${baseUrl}/api/issues/${issueId}/comments`, {
            user_id: currentUserId,
            text: newComment
        });
        // You might want to re-fetch comments here to get the real ID from the server
    } catch (err) {
        console.error("Failed to post comment:", err);
        // Optionally, remove the optimistic comment from the list on failure
        setComments(comments.filter(c => c.id !== newCommentObject.id));
        alert("Failed to post comment.");
    }
    */
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) return <div className="status-container"><div className="loader"></div><p>Loading Issue Details...</p></div>;
  if (error) return (
    <div className="status-container error">
      <h3>Error</h3>
      <p>{error}</p>
      <Link to="/issues" className="view-details-btn">← Go back to Issues List</Link>
    </div>
  );
  if (!issue) return <div className="status-container"><h3>Issue Not Found</h3></div>;

  return (
    <>
      <ComponentStyles />
      <div className="issue-detail-container">
        <div className="issue-detail-card">
          <header className="issue-detail-header">
            <h1 className="issue-detail-title">{issue.issue_title}</h1>
            <StatusBadge status={issue.status} />
          </header>

          <section className="issue-detail-meta">
            <div className="meta-item"><LocationIcon /> {issue.location}</div>
            <div className="meta-item"><CalendarIcon /> Reported on {formatDate(issue.created_at)}</div>
            <div className="meta-item"><CategoryIcon /> Category: <strong>{issue.category}</strong></div>
          </section>

          <p className="issue-detail-description">{issue.description}</p>
          
          {issue.images && issue.images.length > 0 && (
            <div className="image-gallery-section">
              <div className="main-image-container"><img src={mainImage} alt="Main Issue View" className="main-issue-image" /></div>
              <div className="thumbnail-gallery">
                {issue.images.map((img, index) => (
                  <div key={index} className={`thumbnail-item ${img === mainImage ? 'active' : ''}`} onClick={() => setMainImage(img)}>
                    <img src={img} alt={`Issue thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="card-footer">
            <button className={`upvote-button ${hasUpvoted ? 'active' : ''}`} onClick={handleUpvoteClick}>
              <UpvoteIcon filled={hasUpvoted} />
              <span>{upvoteCount} Upvote{upvoteCount !== 1 ? 's' : ''}</span>
            </button>
          </div>
          
          <hr className="issue-detail-hr" />

          <section className="issue-detail-comments">
            <button className="comments-toggle-button" onClick={() => setIsCommentsVisible(!isCommentsVisible)}>
              <CommentsIcon />
              <span>{isCommentsVisible ? 'Hide' : 'Show'} Comments ({comments.length})</span>
            </button>
            <div className={`comments-wrapper ${isCommentsVisible ? 'open' : ''}`}>
              <div className="comment-list">
                {comments.length > 0 ? comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <img src={comment.avatar || 'https://i.pravatar.cc/150?u=default'} alt={comment.author} className="comment-avatar" />
                    <div className="comment-content">
                      <strong className="comment-author">{comment.author}</strong>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                )) : (
                  <p className="no-comments-text">Be the first to comment.</p>
                )}
              </div>
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Join the conversation..." rows="4" />
                <button type="submit" className="submit-button">Post Comment</button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

const styles = {
  badge: { padding: '0.4rem 0.8rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.5px', lineHeight: '1' },
};

const ComponentStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;700&family=Inter:wght@400;500;700&display=swap');
    :root {
      --font-serif: 'Lora', serif; --font-sans: 'Inter', sans-serif; --accent-pink: #EC4899; --accent-blue: #3B82F6; --accent-teal: #1DD3B0; --text-dark: #0F172A; --text-light: #64748B; --card-bg: #FFFFFF; --border-color: #E2E8F0; --shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.07); --bg-color: #F8FAFC; --red: #ef4444;
    }
    body { margin: 0; background-color: var(--bg-color); }
    .issue-detail-container { font-family: var(--font-sans); padding: 3rem 1.5rem; }
    .issue-detail-card { max-width: 900px; margin: 0 auto; background: var(--card-bg); border-radius: 20px; padding: 2.5rem 3rem; box-shadow: var(--shadow); border: 1px solid var(--border-color); }
    .issue-detail-header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px dashed var(--border-color); }
    .issue-detail-title { font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 2.75rem); font-weight: 700; color: var(--text-dark); margin: 0 0 1rem 0; line-height: 1.2; background: -webkit-linear-gradient(45deg, #A855F7, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .issue-detail-meta { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; margin-bottom: 2rem; color: var(--text-light); font-size: 0.9rem; }
    .meta-item { display: flex; align-items: center; background: #F8FAFC; padding: 0.5rem 1rem; border-radius: 99px; }
    .issue-detail-description { font-size: 1.1rem; line-height: 1.7; color: var(--text-dark); margin-bottom: 2rem; }
    .image-gallery-section { margin-bottom: 1.5rem; }
    .main-image-container { border-radius: 12px; overflow: hidden; margin-bottom: 1rem; box-shadow: 0 8px 15px rgba(0,0,0,0.15); background-color: #fff; padding: 8px; border: 1px solid var(--border-color); }
    .main-issue-image { width: 100%; height: 400px; object-fit: contain; display: block; border-radius: 8px; }
    .thumbnail-gallery { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
    .thumbnail-item { width: 100px; height: 80px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.2s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.1); background-color: #fff; }
    .thumbnail-item:hover { border-color: var(--accent-blue); transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
    .thumbnail-item.active { border-color: var(--accent-pink); box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.4); }
    .thumbnail-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .card-footer { display: flex; align-items: center; }
    .upvote-button { display: inline-flex; align-items: center; gap: 0.75rem; font-family: var(--font-sans); font-size: 1rem; font-weight: 600; padding: 0.6rem 1.25rem; border-radius: 99px; cursor: pointer; transition: all 0.2s ease; border: 2px solid var(--border-color); background-color: #F8FAFC; color: var(--text-light); }
    .upvote-button:hover { border-color: var(--accent-blue); color: var(--accent-blue); box-shadow: 0 0 15px rgba(77, 150, 255, 0.2); }
    .upvote-button.active { background-color: var(--accent-blue); border-color: var(--accent-blue); color: #fff; }
    .upvote-button.active:hover { box-shadow: 0 4px 20px rgba(77, 150, 255, 0.4); transform: translateY(-2px); }
    .upvote-button.active svg { color: #fff; }
    .issue-detail-hr { border: none; border-top: 1px dashed var(--border-color); margin: 1.5rem 0; }
    .comments-toggle-button { display: flex; align-items: center; justify-content: center; gap: 0.75rem; width: 100%; padding: 0.8rem 1.25rem; font-size: 1.1rem; font-weight: 500; color: #334155; background-color: rgba(241, 245, 249, 0.8); border: 1px solid var(--border-color); border-radius: 12px; cursor: pointer; transition: all 0.2s ease; text-align: left; }
    .comments-toggle-button:hover { background-color: #FFFFFF; border-color: var(--accent-blue); color: var(--accent-blue); box-shadow: 0 0 15px rgba(77, 150, 255, 0.3); }
    .comments-wrapper { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.7s ease-in-out, opacity 0.5s ease-in-out, margin-top 0.5s ease; margin-top: 0; }
    .comments-wrapper.open { max-height: 2000px; opacity: 1; margin-top: 2rem; }
    .comment-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .comment-item { display: flex; align-items: flex-start; gap: 1rem; }
    .comment-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--accent-teal); flex-shrink: 0; }
    .comment-content { background: #fff; border-radius: 8px; padding: 1rem; width: 100%; border: 1px solid var(--border-color);}
    .comment-author { font-weight: 700; color: var(--text-dark); }
    .comment-text { margin: 0.25rem 0 0 0; color: var(--text-light); line-height: 1.6;}
    .no-comments-text { color: var(--text-light); font-style: italic; text-align: center; padding: 1rem; }
    .comment-form { margin-top: 2rem; }
    .comment-form textarea { width: 100%; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-sans); font-size: 1rem; resize: vertical; transition: border-color 0.2s, box-shadow 0.2s; }
    .comment-form textarea:focus { outline: none; border-color: var(--accent-pink); box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3); }
    .submit-button { margin-top: 1rem; padding: 0.8rem 1.75rem; font-size: 1rem; font-weight: 500; color: #FFF; background: linear-gradient(90deg, #A855F7, #EC4899); border: none; border-radius: 8px; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .submit-button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4); }
    .status-container { text-align: center; padding: 4rem 1rem; color: var(--text-light); }
    .status-container.error h3 { color: var(--red); }
    .loader { width: 48px; height: 48px; border: 5px solid var(--accent-color); border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite; margin-bottom: 1rem; }
    .view-details-btn { font-weight: 500; color: var(--accent-blue); text-decoration: none; transition: color 0.2s ease; }
    @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `}</style>
);

export default IssueDetail;