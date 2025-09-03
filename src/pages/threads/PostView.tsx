import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  ThumbUpOutlined,
  ThumbUp,
  BookmarkBorder,
  Bookmark,
  FlagOutlined,
  Flag,
  Edit,
  Delete,
  Comment,
} from '@mui/icons-material';
import type { Post } from '../../app/types/post';
import { useUpdatePost, useDeletePost, useTogglePostLike, useTogglePostSave, useCreateComment, useTogglePostFlag } from '../../hooks/useForum';

interface PostViewProps {
  post: Post;
  threadId: string;
  isLocked: boolean;
  depth: number;
}

const PostView: React.FC<PostViewProps> = ({ post, threadId, isLocked, depth }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [newCommentContent, setNewCommentContent] = useState('');

  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const togglePostLikeMutation = useTogglePostLike();
  const togglePostSaveMutation = useTogglePostSave();
  const createCommentMutation = useCreateComment();
  const togglePostFlagMutation = useTogglePostFlag();

  const handleUpdatePost = () => {
    updatePostMutation.mutate({ postId: post.uuid, data: { content: editedContent } }, {
      onSuccess: () => setEditMode(false),
    });
  };

  const handleDeletePost = () => {
    if (window.confirm('Delete this post?')) {
      deletePostMutation.mutate(post.uuid);
    }
  };

  const handleToggleLike = () => {
    togglePostLikeMutation.mutate({ postId: post.uuid, action: post.is_liked ? 'unlike' : 'like' });
  };

  const handleToggleSave = () => {
    togglePostSaveMutation.mutate({ postId: post.uuid, action: post.is_saved ? 'unsave' : 'save' });
  };

  const handleCreateComment = () => {
    createCommentMutation.mutate({ postId: post.uuid, data: { content: newCommentContent } }, {
      onSuccess: () => setNewCommentContent(''),
    });
  };

  const handleToggleFlag = () => {
    togglePostFlagMutation.mutate(post.uuid);
  };

  const userInitials = post.user?.name?.[0] || post.user?.email?.[0] || '?';

  return (
    <Card
      sx={{
        mb: 2,
        ml: depth * 4,
        borderLeft: depth > 0 ? '4px solid #e0e0e0' : 'none',
        boxShadow: depth > 0 ? 1 : 3,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{userInitials}</Avatar>
          <Box>
            <Typography variant="subtitle1">{post.user?.name || post.user?.email}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.created_at).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        {editMode ? (
          <Box>
            <TextField
              fullWidth
              multiline
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button onClick={handleUpdatePost} variant="contained" size="small" sx={{ mr: 1 }}>
              Save
            </Button>
            <Button onClick={() => setEditMode(false)} variant="outlined" size="small">
              Cancel
            </Button>
          </Box>
        ) : (
          <Typography variant="body1">{post.content}</Typography>
        )}
        {post.book && (
          <Chip
            label={`Book: ${post.book.title}`}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        )}
        {post.media?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {post.media.map((media) => (
              <Box key={media.id} sx={{ mb: 1 }}>
                {media.file_type === 'pdf' ? (
                  <Button href={media.file_url} target="_blank" rel="noopener noreferrer" variant="outlined" size="small">
                    View PDF
                  </Button>
                ) : (
                  <img
                    src={media.thumbnail_url || media.file_url}
                    alt={media.caption || 'Media'}
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: 4 }}
                  />
                )}
                {media.caption && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{media.caption}</Typography>}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={post.is_liked ? 'Unlike' : 'Like'}>
            <IconButton onClick={handleToggleLike} disabled={isLocked} color={post.is_liked ? 'primary' : 'default'}>
              {post.is_liked ? <ThumbUp /> : <ThumbUpOutlined />}
              <Typography variant="caption" sx={{ ml: 0.5 }}>{post.likes_count}</Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title={post.is_saved ? 'Unsave' : 'Save'}>
            <IconButton onClick={handleToggleSave} disabled={isLocked} color={post.is_saved ? 'primary' : 'default'}>
              {post.is_saved ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
          <Tooltip title={post.is_flagged ? 'Unflag' : 'Flag'}>
            <IconButton onClick={handleToggleFlag} color={post.is_flagged ? 'error' : 'default'}>
              {post.is_flagged ? <Flag /> : <FlagOutlined />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton onClick={() => setEditMode(true)} disabled={isLocked} color="default">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={handleDeletePost} disabled={isLocked} color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
      {!isLocked && (
        <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Add a comment..."
              sx={{ mr: 1 }}
            />
            <Button onClick={handleCreateComment} variant="contained" size="small" startIcon={<Comment />}>
              Comment
            </Button>
          </Box>
        </Box>
      )}
      {post.replies?.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {post.replies.map((reply) => (
            <PostView key={reply.uuid} post={reply} threadId={threadId} isLocked={isLocked} depth={depth + 1} />
          ))}
        </Box>
      )}
    </Card>
  );
};

export default PostView;