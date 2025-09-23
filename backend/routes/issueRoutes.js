import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { addIssue, addIssueUpvote, getAllIssues, getIssueById, removeIssueUpvote, updateIssue } from '../controllers/issueController.js';

const router = express.Router();

// Use upload.array to accept multiple files with field name 'images'
router.post('/issues', upload.array('images', 10), addIssue);
router.get('/issues', getAllIssues);
router.patch('/issues/:id', updateIssue);
router.post('/issues/:id/upvote', addIssueUpvote);
router.delete('/issues/:id/upvote', removeIssueUpvote);
router.get('/issues/:id', getIssueById);


export default router;