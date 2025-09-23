import { addIssueWithImages, fetchAllIssuesWithImagesAndUpvotes } from '../services/issueService.js';

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
    const issues = await fetchAllIssuesWithImagesAndUpvotes();
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
