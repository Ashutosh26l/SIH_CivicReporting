import React, { useState, useEffect } from 'react';

// --- Helper Components & Icons for a cleaner UI ---

const StatusBadge = ({ status }) => {
  const isOpen = status.toLowerCase() === 'open';
  const style = {
    ...styles.badge,
    color: isOpen ? '#098551' : '#D92525',
    backgroundColor: isOpen ? 'rgba(56, 217, 169, 0.2)' : 'rgba(255, 137, 137, 0.2)',
    border: `1px solid ${isOpen ? 'rgba(56, 217, 169, 0.7)' : 'rgba(255, 137, 137, 0.7)'}`,
  };
  return <span style={style}>{status.toUpperCase()}</span>;
};

// SVG Icons
const LocationIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginRight: '8px' }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginRight: '8px' }}><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>;
const CategoryIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginRight: '8px' }}><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>;
const CommentsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>;

// --- Main Component ---

const IssueDetail = () => {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [comments, setComments] = useState([
    { id: 1, author: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=jane', text: 'Thanks for reporting this. Our team is actively looking into it and we hope to provide an update soon.' },
    { id: 2, author: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=john', text: 'I noticed the same issue yesterday! Glad it\'s being tracked now.' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  
  // State for the main large image display
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchIssueData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/issues`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setIssue(data.issues[0]);
        // Set the first image as the main image initially
        if (data.issues[0] && data.issues[0].images.length > 0) {
          setMainImage(data.issues[0].images[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssueData();
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([
        ...comments,
        { id: Date.now(), author: 'You', avatar: 'https://i.pravatar.cc/150?u=current_user', text: newComment },
      ]);
      setNewComment('');
    }
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) return <div className="issue-detail-status">Loading...</div>;
  if (error) return <div className="issue-detail-status error">Error: {error}</div>;
  if (!issue) return <div className="issue-detail-status">No issue data found.</div>;

  return (
    <>
      <ComponentStyles /> {/* Injects the CSS into the page */}
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
          
          {/* --- Image Gallery --- */}
          {issue.images && issue.images.length > 0 && (
            <div className="image-gallery-section">
              <div className="main-image-container">
                <img src={mainImage || issue.images[0]} alt="Main Issue View" className="main-issue-image" />
              </div>
              <div className="thumbnail-gallery">
                {issue.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-item ${img === mainImage ? 'active' : ''}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`Issue thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="issue-detail-upvotes">
            👍 {issue.upvotes.count} Upvote{issue.upvotes.count !== 1 ? 's' : ''}
          </div>
          
          <hr className="issue-detail-hr" />

          {/* --- Collapsible Comments Section --- */}
          <section className="issue-detail-comments">
            <button 
              className="comments-toggle-button" 
              onClick={() => setIsCommentsVisible(!isCommentsVisible)}
            >
              <CommentsIcon />
              <span>{isCommentsVisible ? 'Hide' : 'Show'} Comments ({comments.length})</span>
            </button>
            
            <div className={`comments-wrapper ${isCommentsVisible ? 'open' : ''}`}>
              <div className="comment-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
                    <div className="comment-content">
                      <strong className="comment-author">{comment.author}</strong>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Join the conversation..."
                  rows="4"
                />
                <button type="submit" className="submit-button">Post Comment</button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

// --- Scoped CSS for the component ---
const ComponentStyles = () => (
  <style>{`
    /* FONT IMPORTS */
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;700&family=Inter:wght@400;500;700&display=swap');

    /* COLOR & STYLE VARIABLES */
    :root {
      --font-serif: 'Lora', serif;
      --font-sans: 'Inter', sans-serif;
      --accent-pink: #FF6B6B;
      --accent-blue: #4D96FF;
      --accent-teal: #1DD3B0;
      --text-dark: #0F172A;
      --text-light: #64748B;
      --card-bg: rgba(255, 255, 255, 0.9); /* Slightly less transparent */
      --border-color: rgba(226, 232, 240, 0.7);
      --shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
      --bg-gradient: linear-gradient(135deg, #f0f4f8 0%, #e6e9ee 100%); /* Subtle white gradient */
    }
    
    body {
      margin: 0;
      background: var(--bg-gradient); /* Apply background to body to ensure full coverage */
    }

    .issue-detail-container {
      font-family: var(--font-sans);
      background-color: transparent; /* Container background transparent, body handles the main background */
      padding: 3rem 1.5rem;
      min-height: 100vh;
      display: flex; /* Use flex to center card vertically */
      align-items: center; /* Center vertically */
      justify-content: center; /* Center horizontally */
    }

    .issue-detail-card {
      max-width: 900px;
      margin: 0 auto;
      background: var(--card-bg);
      border-radius: 20px;
      padding: 2.5rem 3rem;
      box-shadow: var(--shadow);
      border: 1px solid rgba(255, 255, 255, 0.5); /* Lighter border for glass effect */
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      width: 100%; /* Ensure it takes full width up to max-width */
    }
    
    .issue-detail-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px dashed var(--border-color); /* Subtle divider */
    }

    .issue-detail-title {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 5vw, 2.75rem);
      font-weight: 700;
      color: var(--text-dark);
      margin: 0 0 1rem 0;
      line-height: 1.2;
      background: -webkit-linear-gradient(45deg, #A855F7, #EC4899); /* Updated vibrant gradient */
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .issue-detail-meta {
      display: flex; flex-wrap: wrap; justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      color: var(--text-light);
      font-size: 0.9rem;
    }
    
    .meta-item { display: flex; align-items: center; background: #F8FAFC; padding: 0.5rem 1rem; border-radius: 99px; }

    .issue-detail-description { font-size: 1.1rem; line-height: 1.7; color: var(--text-dark); margin-bottom: 2rem; }
    
    /* --- New Image Gallery Styles --- */
    .image-gallery-section {
      margin-bottom: 2rem;
    }

    .main-image-container {
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 1rem;
      box-shadow: 0 8px 15px rgba(0,0,0,0.15);
      background-color: #fff;
      padding: 8px; /* Slight padding around the main image */
      border: 1px solid var(--border-color);
    }
    .main-issue-image {
      width: 100%;
      height: 400px; /* Fixed height for consistency */
      object-fit: contain; /* Ensure entire image is visible without cropping */
      display: block;
      border-radius: 8px;
    }

    .thumbnail-gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
    }
    .thumbnail-item {
      width: 100px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      background-color: #fff;
    }
    .thumbnail-item:hover {
      border-color: var(--accent-blue);
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    .thumbnail-item.active {
      border-color: var(--accent-pink);
      box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.4);
    }
    .thumbnail-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    
    .issue-detail-upvotes { font-weight: 500; color: var(--text-light); }

    .issue-detail-hr { border: none; border-top: 1px dashed var(--border-color); margin: 2rem 0; }
    
    /* --- Comments Section Styling --- */
    .comments-toggle-button {
      display: flex; align-items: center; justify-content: center; gap: 0.75rem;
      width: 100%;
      padding: 0.8rem 1.25rem;
      font-size: 1.1rem; font-weight: 500;
      color: #334155;
      background-color: rgba(241, 245, 249, 0.8);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }
    .comments-toggle-button:hover {
      background-color: #FFFFFF;
      border-color: var(--accent-blue);
      color: var(--accent-blue);
      box-shadow: 0 0 15px rgba(77, 150, 255, 0.3);
    }
    .comments-toggle-button svg {
      transition: transform 0.3s ease;
    }
    .comments-toggle-button:hover svg {
      transform: scale(1.1);
    }
    
    .comments-wrapper {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 0.7s ease-in-out, opacity 0.5s ease-in-out, margin-top 0.5s ease;
      margin-top: 0;
    }
    .comments-wrapper.open {
      max-height: 2000px; /* Large enough value */
      opacity: 1;
      margin-top: 2rem;
    }
    
    .comment-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .comment-item { display: flex; align-items: flex-start; gap: 1rem; }
    .comment-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--accent-teal); flex-shrink: 0; }
    .comment-content { background: #fff; border-radius: 8px; padding: 1rem; width: 100%; border: 1px solid var(--border-color);}
    .comment-author { font-weight: 700; color: var(--text-dark); }
    .comment-text { margin: 0.25rem 0 0 0; color: var(--text-light); line-height: 1.6;}

    .comment-form { margin-top: 2rem; }
    .comment-form textarea { width: 100%; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-sans); font-size: 1rem; resize: vertical; transition: border-color 0.2s, box-shadow 0.2s; }
    .comment-form textarea:focus { outline: none; border-color: var(--accent-pink); box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3); }
    
    .submit-button {
      margin-top: 1rem; padding: 0.8rem 1.75rem;
      font-size: 1rem; font-weight: 500; color: #FFF;
      background: linear-gradient(90deg, #A855F7, #EC4899); /* Re-used title gradient for button */
      border: none; border-radius: 8px; cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .submit-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4); /* Pinkish shadow on hover */
    }
  `}</style>
);


const styles = {
  badge: {
    padding: '0.4rem 0.8rem',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
    lineHeight: '1',
  },
};

export default IssueDetail;