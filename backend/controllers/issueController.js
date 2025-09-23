import { addIssueWithImages, fetchAllIssuesWithImagesUpvotesComments, fetchIssueByIdWithImagesUpvotesComments, removeUpvote, updateIssueById } from '../services/issueService.js';
import { addUpvote } from '../services/issueService.js';
import { addComment } from '../services/issueService.js';


export const addIssue = async (req, res) => {
  try {
    const { latitude, longitude, location, issue_title, description, category, user_id } = req.body;

    if (!latitude || !longitude || !location || !issue_title || !category || !user_id) {
      return res.status(400).json({ error: 'Required fields missing (including user_id)' });
    }

    const issueData = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      location,
      issue_title,
      description: description || null,
      category,
    };

    const files = req.files || [];
    if (files.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images allowed' });
    }

    const result = await addIssueWithImages(issueData, files, user_id);

    res.status(201).json({ message: 'Issue created', issue: result.issue, images: result.images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};



export const getAllIssues = async (req, res) => {
  try {
    const issues = await fetchAllIssuesWithImagesUpvotesComments();
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};


export const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const updated = await updateIssueById(id, updates);
    res.json({ message: 'Issue updated', issue: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};





export const addIssueUpvote = async (req, res) => {
  try {
    const { id } = req.params; // issue_id
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: 'user_id required' });

    await addUpvote(id, user_id);
    res.json({ message: 'Upvote added' });
  } catch (error) {
    if (error.code === '23505') { // unique_violation in Postgres
      return res.status(409).json({ error: 'Already upvoted by this user' });
    }
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const removeIssueUpvote = async (req, res) => {
  try {
    const { id } = req.params; // issue_id
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: 'user_id required' });

    await removeUpvote(id, user_id);
    res.json({ message: 'Upvote removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};


export const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await fetchIssueByIdWithImagesUpvotesComments(id);
    res.json({ issue });
  } catch (error) {
    res.status(404).json({ error: error.message || 'Issue not found' });
  }
};


export const addIssueComment = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { user_id, comment } = req.body;

    if (!user_id || !comment) {
      return res.status(400).json({ error: 'user_id and comment required' });
    }

    const newComment = await addComment(issueId, user_id, comment);
    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};


export const deleteIssueComment = async (req, res) => {
  try {
    const { issueId, commentId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const deleted = await deleteComment(commentId, user_id);
    if (!deleted) {
      return res.status(403).json({ error: 'Not allowed to delete this comment' });
    }
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
