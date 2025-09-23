import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { addIssue, getAllIssues } from '../controllers/issueController.js';

const router = express.Router();

// Use upload.array to accept multiple files with field name 'images'
router.post('/issues', upload.array('images', 10), addIssue);
router.get('/issues', getAllIssues);

export default router;
