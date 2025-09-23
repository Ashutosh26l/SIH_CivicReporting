import { uploadImageToCloudinary } from './cloudinaryService.js';
import { supabase } from '../config/supabaseClient.js';

export const addIssueWithImages = async (issueData, files, userId) => {
  // Upload images as before
  const uploadPromises = files.map(file =>
    uploadImageToCloudinary(file.buffer)
  );
  const imageUrls = await Promise.all(uploadPromises);

  // Insert issue
  const { data: issue, error: issueError } = await supabase
    .from('issues')
    .insert([issueData])
    .select()
    .single();

  if (issueError) throw issueError;

  // Insert submitter's upvote automatically
  if (userId) {
    const { error: upvoteError } = await supabase
      .from('issue_upvotes')
      .insert([{ issue_id: issue.id, user_id: userId }]);

    if (upvoteError) throw upvoteError;
  }

  // Insert other images URLs
  if (imageUrls.length > 0) {
    const imagesToInsert = imageUrls.map(url => ({
      issue_id: issue.id,
      image_url: url,
    }));

    const { error: imageError } = await supabase
      .from('issue_images')
      .insert(imagesToInsert);

    if (imageError) throw imageError;
  }

  return { issue, images: imageUrls };
};




export const fetchAllIssuesWithImagesAndUpvotes = async () => {
  // Fetch issues without expanding assigned_official
  const { data: issues, error: issuesError } = await supabase
    .from('issues')
    .select('*')  // simple select all columns
    .order('created_at', { ascending: false });

  if (issuesError) throw issuesError;
  if (!issues || issues.length === 0) return [];

  const issueIds = issues.map(i => i.id);

  const { data: images, error: imagesError } = await supabase
    .from('issue_images')
    .select('*')
    .in('issue_id', issueIds);

  if (imagesError) throw imagesError;

  const imagesByIssue = images.reduce((acc, img) => {
    acc[img.issue_id] = acc[img.issue_id] || [];
    acc[img.issue_id].push(img.image_url);
    return acc;
  }, {});

  const { data: upvotes, error: upvotesError } = await supabase
    .from('issue_upvotes')
    .select('issue_id, user_id')
    .in('issue_id', issueIds);

  if (upvotesError) throw upvotesError;

  const upvotesByIssue = upvotes.reduce((acc, uv) => {
    acc[uv.issue_id] = acc[uv.issue_id] || [];
    acc[uv.issue_id].push(uv.user_id);
    return acc;
  }, {});

  return issues.map(issue => ({
    ...issue,
    images: imagesByIssue[issue.id] || [],
    upvotes: {
      count: (upvotesByIssue[issue.id]?.length) || 0,
      users: upvotesByIssue[issue.id] || [],
    },
    assigned_official: null, // explicitly set to null for now
  }));
};