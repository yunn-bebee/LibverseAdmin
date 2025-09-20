import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Comment as CommentIcon,
  Edit as EditIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useThread,
  usePosts,
  useDeletePost,
  useTogglePostLike,
  useTogglePostSave,
  useCreateComment,
  useCreatePost,
  useUpdatePost,
  useDeleteThread,

  useUpdateMedia,
  useDeleteMedia,
} from '../../hooks/useForum';
import ThreadForm from './ThreadForm';
import type { Post, Media } from '../../app/types/forum';

const ThreadDetail: React.FC = () => {
  const { forumId, threadId } = useParams<{ forumId: string; threadId: string }>();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{ page: number; per_page: number }>({ page: 1, per_page: 10 });
  const [newComment, setNewComment] = useState('');
  const [newPost, setNewPost] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaCaptions, setMediaCaptions] = useState<string[]>([]);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editMediaId, setEditMediaId] = useState<string | null>(null);
  const [editMediaFile, setEditMediaFile] = useState<File | null>(null);
  const [editMediaCaption, setEditMediaCaption] = useState('');
  const [editThreadOpen, setEditThreadOpen] = useState(false);

  const { data: thread, isLoading: threadLoading, error: threadError } = useThread(threadId!);
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts(threadId!, { page: filters.page }, filters.per_page);
  const deletePost = useDeletePost();
  const toggleLike = useTogglePostLike();
  const toggleSave = useTogglePostSave();
  const createComment = useCreateComment();
  const createPost = useCreatePost(threadId!);
  const updatePost = useUpdatePost();
  const deleteThread = useDeleteThread();

  const updateMedia = useUpdateMedia();
  const deleteMedia = useDeleteMedia();

  const handleFilterChange = (key: string, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : prev.page }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(files);
    setMediaCaptions(new Array(files.length).fill(''));
  };

  const handleCaptionChange = (index: number, value: string) => {
    setMediaCaptions((prev) => {
      const newCaptions = [...prev];
      newCaptions[index] = value;
      return newCaptions;
    });
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }
    const formData = new FormData();
    formData.append('content', newPost);
    mediaFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
      if (mediaCaptions[index]) {
        formData.append(`files_captions[${index}]`, mediaCaptions[index]);
      }
    });
    createPost.mutate(formData, {
      onSuccess: () => {
        toast.success('Post created');
        setNewPost('');
        setMediaFiles([]);
        setMediaCaptions([]);
      },
      onError: () => toast.error('Error creating post'),
    });
  };

  const handleEditPost = (post: Post) => {
    setEditPostId(post.id.toString());
    setEditPostContent(post.content);
  };

  const handleUpdatePost = (postId: string) => {
    if (!editPostContent.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }
    updatePost.mutate({ postId, data: { content: editPostContent } }, {
      onSuccess: () => {
        toast.success('Post updated');
        setEditPostId(null);
        setEditPostContent('');
      },
      onError: () => toast.error('Error updating post'),
    });
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost.mutate(postId, {
        onSuccess: () => toast.success('Post deleted'),
        onError: () => toast.error('Error deleting post'),
      });
    }
  };

  const handleLikePost = (postId: string, isLiked: boolean) => {
    toggleLike.mutate({ postId, action: isLiked ? 'unlike' : 'like' }, {
      onSuccess: () => toast.success(isLiked ? 'Post unliked' : 'Post liked'),
      onError: () => toast.error('Error toggling like'),
    });
  };

  const handleSavePost = (postId: string, isSaved: boolean) => {
    toggleSave.mutate({ postId, action: isSaved ? 'unsave' : 'save' }, {
      onSuccess: () => toast.success(isSaved ? 'Post unsaved' : 'Post saved'),
      onError: () => toast.error('Error toggling save'),
    });
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    createComment.mutate({ postId, data: { content: newComment } }, {
      onSuccess: () => {
        toast.success('Comment added');
        setNewComment('');
      },
      onError: () => toast.error('Error adding comment'),
    });
  };

  const handleDeleteThread = () => {
    if (window.confirm('Are you sure you want to delete this thread?')) {
      deleteThread.mutate(threadId!, {
        onSuccess: () => {
          toast.success('Thread deleted');
          navigate(`/admin/forums/${forumId}`);
        },
        onError: () => toast.error('Error deleting thread'),
      });
    }
  };

  const handleEditMedia = (media: Media) => {
    setEditMediaId(media.id.toString());
    setEditMediaCaption(media.caption || '');
    setEditMediaFile(null);
  };

  const handleUpdateMedia = (postId: string, mediaId: string) => {
    if (!editMediaFile && !editMediaCaption.trim()) {
      toast.error('No changes provided for media');
      return;
    }
    const formData = new FormData();
    if (editMediaFile) {
      formData.append('file', editMediaFile);
    }
    if (editMediaCaption) {
      formData.append('caption', editMediaCaption);
    }
    updateMedia.mutate({ postId, mediaId, formData }, {
      onSuccess: () => {
        toast.success('Media updated');
        setEditMediaId(null);
        setEditMediaFile(null);
        setEditMediaCaption('');
      },
      onError: () => toast.error('Error updating media'),
    });
  };

  const handleDeleteMedia = (postId: string, mediaId: string) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      deleteMedia.mutate({ postId, mediaId }, {
        onSuccess: () => toast.success('Media deleted'),
        onError: () => toast.error('Error deleting media'),
      });
    }
  };

  if (threadLoading || postsLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />;
  if (threadError || postsError || !thread || !postsData) return <Typography color="error" sx={{ p: 3 }}>Error loading thread or posts</Typography>;

  const pagination = postsData?.meta?.pagination || { current_page: 1, total_pages: 1, total: 0 };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Card sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {thread.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {thread.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Posted by {thread.user.username} on {new Date(thread.created_at).toLocaleDateString()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Typography variant="body2">
              <strong>Posts:</strong> {thread.posts_count}
            </Typography>
            <Typography variant="body2">
              <strong>Pinned:</strong> {thread.is_pinned ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2">
              <strong>Locked:</strong> {thread.is_locked ? 'Yes' : 'No'}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            onClick={() => setEditThreadOpen(true)}
            startIcon={<EditIcon />}
            aria-label="Edit thread"
          >
            Edit Thread
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteThread}
            startIcon={<DeleteIcon />}
            aria-label="Delete thread"
          >
            Delete Thread
          </Button>
        </CardActions>
      </Card>
      <Card sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <TextField
            label="Create a new post"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
            sx={{ mb: 2 }}
            aria-label="Create new post"
          />
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              aria-label="Upload media"
            >
              Upload Media
              <input
                type="file"
                hidden
                multiple
                accept="image/jpeg,image/png,video/mp4,application/pdf"
                onChange={handleFileChange}
              />
            </Button>
            {mediaFiles.map((file, index) => (
              <Box key={index} sx={{ mt: 1 }}>
                <Typography variant="body2">{file.name}</Typography>
                <TextField
                  label={`Caption for ${file.name}`}
                  value={mediaCaptions[index] || ''}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                  aria-label={`Caption for media ${index + 1}`}
                />
              </Box>
            ))}
          </Box>
          <Button
            variant="contained"
            onClick={handleCreatePost}
            disabled={!newPost.trim() || createPost.isPending}
            aria-label="Submit new post"
          >
            {createPost.isPending ? <CircularProgress size={20} /> : 'Post'}
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {postsData.data.map((post: Post) => (
          <Card key={post.id} sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {post.user.username} • {new Date(post.created_at).toLocaleDateString()}
              </Typography>
              {editPostId === post.id.toString() ? (
                <Box>
                  <TextField
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    sx={{ mb: 1 }}
                    aria-label="Edit post content"
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleUpdatePost(post.id.toString())}
                    disabled={!editPostContent.trim() || updatePost.isPending}
                    aria-label="Save edited post"
                    sx={{ mr: 1 }}
                  >
                    {updatePost.isPending ? <CircularProgress size={20} /> : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditPostId(null)}
                    aria-label="Cancel edit"
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {post.content}
                </Typography>
              )}
              {post.book && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Book:</strong> {post.book.title}
                </Typography>
              )}
              {post.media?.map((media: Media) => (
                <Box key={media.id} sx={{ mt: 2 }}>
                  {editMediaId === media.id.toString() ? (
                    <Box>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<ImageIcon />}
                        aria-label="Replace media"
                      >
                        Replace Media
                        <input
                          type="file"
                          hidden
                          accept="image/jpeg,image/png,video/mp4,application/pdf"
                          onChange={(e) => setEditMediaFile(e.target.files?.[0] || null)}
                        />
                      </Button>
                      <TextField
                        label="Media Caption"
                        value={editMediaCaption}
                        onChange={(e) => setEditMediaCaption(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ mt: 1, mb: 1 }}
                        aria-label="Edit media caption"
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleUpdateMedia(post.id.toString(), media.id.toString())}
                        disabled={updateMedia.isPending}
                        aria-label="Save media changes"
                        sx={{ mr: 1 }}
                      >
                        {updateMedia.isPending ? <CircularProgress size={20} /> : 'Save'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditMediaId(null)}
                        aria-label="Cancel media edit"
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      {media.file_type === 'jpg' || media.file_type === 'jpeg' || media.file_type === 'png' ? (
                        <img
                          src={media.file_url}
                          alt={media.caption || 'Post media'}
                          style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }}
                        />
                      ) : media.file_type === 'mp4' ? (
                        <video
                          src={media.file_url}
                          controls
                          poster={media.thumbnail_url || ''}
                          style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }}
                        />
                      ) : media.file_type === 'pdf' ? (
                        <a href={media.file_url} target="_blank" rel="noopener noreferrer">
                          <Typography variant="body2">View PDF: {media.caption || 'Document'}</Typography>
                        </a>
                      ) : null}
                      {media.caption && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {media.caption}
                        </Typography>
                      )}
                      <Box sx={{ mt: 1 }}>
                        <IconButton
                          onClick={() => handleEditMedia(media)}
                          aria-label={`Edit media ${media.caption || 'item'}`}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteMedia(post.id.toString(), media.id.toString())}
                          aria-label={`Delete media ${media.caption || 'item'}`}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
            <CardActions>
              <Button
                startIcon={<FavoriteIcon color={post.is_liked ? 'error' : 'inherit'} />}
                onClick={() => handleLikePost(post.id.toString(), post.is_liked)}
                disabled={toggleLike.isPending}
                aria-label={post.is_liked ? `Unlike post by ${post.user.username}` : `Like post by ${post.user.username}`}
              >
                {post.likes_count} Likes
              </Button>
              <Button
                startIcon={<BookmarkIcon color={post.is_saved ? 'primary' : 'inherit'} />}
                onClick={() => handleSavePost(post.id.toString(), post.is_saved)}
                disabled={toggleSave.isPending}
                aria-label={post.is_saved ? `Unsave post by ${post.user.username}` : `Save post by ${post.user.username}`}
              >
                {post.saves_count} Saves
              </Button>
              <Button
                startIcon={<CommentIcon />}
                aria-label={`View ${post.replies_count} comments`}
              >
                {post.replies_count} Comments
              </Button>
              <IconButton
                onClick={() => handleEditPost(post)}
                aria-label={`Edit post by ${post.user.username}`}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDeletePost(post.id.toString())}
                aria-label={`Delete post by ${post.user.username}`}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
            {post.replies?.map((reply: Post) => (
              <CardContent key={reply.id} sx={{ pl: 4, borderLeft: '2px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  {reply.user.username} • {new Date(reply.created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">{reply.content}</Typography>
                {reply.media?.map((media: Media) => (
                  <Box key={media.id} sx={{ mt: 1 }}>
                    {media.file_type === 'jpg' || media.file_type === 'jpeg' || media.file_type === 'png' ? (
                      <img
                        src={media.file_url}
                        alt={media.caption || 'Reply media'}
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    ) : media.file_type === 'mp4' ? (
                      <video
                        src={media.file_url}
                        controls
                        poster={media.thumbnail_url || ''}
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    ) : media.file_type === 'pdf' ? (
                      <a href={media.file_url} target="_blank" rel="noopener noreferrer">
                        <Typography variant="body2">View PDF: {media.caption || 'Document'}</Typography>
                      </a>
                    ) : null}
                    {media.caption && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {media.caption}
                      </Typography>
                    )}
                  </Box>
                ))}
              </CardContent>
            ))}
            <CardContent>
              <TextField
                label="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
                multiline
                size="small"
                sx={{ mb: 1 }}
                aria-label="Add a comment"
              />
              <Button
                variant="contained"
                onClick={() => handleAddComment(post.id.toString())}
                disabled={!newComment.trim() || createComment.isPending}
                aria-label="Submit comment"
              >
                {createComment.isPending ? <CircularProgress size={20} /> : 'Comment'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button
          disabled={pagination.current_page === 1 || postsLoading}
          onClick={() => handleFilterChange('page', pagination.current_page - 1)}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Typography>
          Page {pagination.current_page} of {pagination.total_pages} (Total: {pagination.total})
        </Typography>
        <FormControl size="small">
          <InputLabel id="per-page-label">Items per page</InputLabel>
          <Select
            labelId="per-page-label"
            value={filters.per_page}
            label="Items per page"
            onChange={(e) => handleFilterChange('per_page', Number(e.target.value))}
            disabled={postsLoading}
            aria-label="Items per page"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
        </FormControl>
        <Button
          disabled={pagination.current_page === pagination.total_pages || postsLoading}
          onClick={() => handleFilterChange('page', pagination.current_page + 1)}
          aria-label="Next page"
        >
          Next
        </Button>
      </Box>
      <Button
        variant="outlined"
        onClick={() => navigate(`/admin/forums/${forumId}`)}
        sx={{ mt: 2 }}
        aria-label="Back to forum"
      >
        Back
      </Button>
      <ThreadForm open={editThreadOpen} onClose={() => setEditThreadOpen(false)} thread={thread} />
    </Box>
  );
};

export default ThreadDetail;