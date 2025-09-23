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



export const updateIssueById = async (id, updates) => {
  const { data, error } = await supabase
    .from('issues')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addUpvote = async (issue_id, user_id) => {
  const { error } = await supabase
    .from('issue_upvotes')
    .insert([{ issue_id, user_id }]);

  if (error) throw error;
};


export const removeUpvote = async (issue_id, user_id) => {
  const { error } = await supabase
    .from('issue_upvotes')
    .delete()
    .eq('issue_id', issue_id)
    .eq('user_id', user_id);

  if (error) throw error;
};

export const addComment = async (issue_id, user_id, comment) => {
  const { data, error } = await supabase
    .from('issue_comments')
    .insert([{ issue_id, user_id, comment }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteComment = async (comment_id, user_id) => {
  // Only delete if user_id matches
  const { data, error } = await supabase
    .from('issue_comments')
    .delete()
    .eq('id', comment_id)
    .eq('user_id', user_id)
    .select();

  if (error) throw error;
  return data && data.length > 0; // Returns true if deleted
};


export const fetchAllIssuesWithImagesUpvotesComments = async () => {
  const { data: issues, error: issuesError } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });

  if (issuesError) throw issuesError;
  if (!issues || issues.length === 0) return [];

  const issueIds = issues.map(i => i.id);

  const { data: images, error: imagesError } = await supabase
    .from('issue_images')
    .select('*')
    .in('issue_id', issueIds);

  if (imagesError) throw imagesError;

  const { data: upvotes, error: upvotesError } = await supabase
    .from('issue_upvotes')
    .select('issue_id, user_id')
    .in('issue_id', issueIds);

  if (upvotesError) throw upvotesError;

  const { data: comments, error: commentsError } = await supabase
    .from('issue_comments')
    .select('*')
    .in('issue_id', issueIds)
    .order('created_at', { ascending: true });

  if (commentsError) throw commentsError;

  const imagesByIssue = images.reduce((acc, img) => {
    acc[img.issue_id] = acc[img.issue_id] || [];
    acc[img.issue_id].push(img.image_url);
    return acc;
  }, {});

  const upvotesByIssue = upvotes.reduce((acc, uv) => {
    acc[uv.issue_id] = acc[uv.issue_id] || [];
    acc[uv.issue_id].push(uv.user_id);
    return acc;
  }, {});

  const commentsByIssue = comments.reduce((acc, cm) => {
    acc[cm.issue_id] = acc[cm.issue_id] || [];
    acc[cm.issue_id].push({
      id: cm.id,
      user_id: cm.user_id,
      comment: cm.comment,
      created_at: cm.created_at,
    });
    return acc;
  }, {});

  return issues.map(issue => ({
    ...issue,
    images: imagesByIssue[issue.id] || [],
    upvotes: {
      count: (upvotesByIssue[issue.id]?.length) || 0,
      users: upvotesByIssue[issue.id] || [],
    },
    comments: commentsByIssue[issue.id] || [],
    assigned_official: null,
  }));
};



export const fetchIssueByIdWithImagesUpvotesComments = async (issueId) => {
  const { data: issue, error: issueError } = await supabase
    .from('issues')
    .select('*')
    .eq('id', issueId)
    .single();

  if (issueError || !issue) throw new Error('Issue not found');

  const { data: images, error: imagesError } = await supabase
    .from('issue_images')
    .select('image_url')
    .eq('issue_id', issueId);

  if (imagesError) throw imagesError;

  const { data: upvotes, error: upvotesError } = await supabase
    .from('issue_upvotes')
    .select('user_id')
    .eq('issue_id', issueId);

  if (upvotesError) throw upvotesError;

  const { data: comments, error: commentsError } = await supabase
    .from('issue_comments')
    .select('*')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true });

  if (commentsError) throw commentsError;

  return {
    ...issue,
    images: images.map(img => img.image_url),
    upvotes: {
      count: upvotes.length,
      users: upvotes.map(uv => uv.user_id)
    },
    comments: comments.map(cm => ({
      id: cm.id,
      user_id: cm.user_id,
      comment: cm.comment,
      created_at: cm.created_at,
    })),
    assigned_official: null,
  };
};
